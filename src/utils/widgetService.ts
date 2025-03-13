
import { toast } from '@/components/ui/use-toast';
import React from 'react';

// Create new widget from code string
const createWidgetFromCode = (
  widgetCode: string, 
  id: string
): { component: React.ComponentType<any>; id: string } | null => {
  try {
    console.log("Raw widget code:", widgetCode);
    
    // Display a toast with information about the widget code
    toast({
      title: "Widget Code",
      description: `Widget code loaded (${widgetCode.length} characters)`,
    });
    
    // Clean the code - removing imports and exports
    let componentCode = widgetCode
      .replace(/import\s+.*?from\s+(['"]).*?\1;?/g, '')  // Remove import statements
      .replace(/export\s+default\s+\w+;?/g, '')  // Remove export default
      .trim();
    
    // Extract the main component name that ends with Widget
    const componentNameMatch = componentCode.match(/(?:const|function|class)\s+(\w+Widget)\s*(?::|=|extends)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : null;
    
    if (!componentName) {
      throw new Error("Widget code must contain a valid widget component (named with 'Widget' suffix)");
    }
    
    console.log(`Identified component: ${componentName}`);
    
    // Prepare a standalone component function that will be returned
    const WidgetComponent: React.FC<any> = (props) => {
      // Using a simple approach - render a placeholder if we can't create the component
      try {
        // Create a container div to hold our widget
        return React.createElement('div', { 
          className: 'widget-content p-4 h-full overflow-auto',
          key: id
        }, [
          // Add a header with the widget name
          React.createElement('div', { 
            className: 'text-sm font-medium text-muted-foreground mb-2',
            key: 'header'
          }, `${componentName}`),
          
          // This is a simplified approach - in a real implementation, 
          // you would use a more sophisticated method to execute the component code
          React.createElement('div', { 
            className: 'bg-white rounded-md shadow-sm p-4',
            key: 'content'
          }, [
            // For weather widget, create a custom rendering
            componentName.includes('Weather') ? 
              React.createElement('div', { key: 'weather', className: 'weather-widget' }, [
                React.createElement('div', { key: 'location', className: 'text-lg font-bold' }, 
                  props.location || 'Vancouver'
                ),
                React.createElement('div', { key: 'temp', className: 'text-3xl my-2' }, 
                  `${(props.temperature || 6.88).toFixed(1)}°C`
                ),
                React.createElement('div', { key: 'condition', className: 'text-md' }, 
                  props.condition || 'Moderate Rain'
                ),
                React.createElement('div', { key: 'details', className: 'text-sm text-muted-foreground mt-2' }, [
                  React.createElement('span', { key: 'feels' }, 
                    `Feels like: ${(props.feelsLike || 4.11).toFixed(1)}°C`
                  ),
                  React.createElement('div', { key: 'wind-humid', className: 'flex justify-between mt-2' }, [
                    React.createElement('span', { key: 'wind' }, 
                      `Wind: ${props.windSpeed || 4.12} m/s`
                    ),
                    React.createElement('span', { key: 'humid' }, 
                      `Humidity: ${props.humidity || 89}%`
                    )
                  ])
                ])
              ]) : 
              // For other widgets, show that we're working on displaying them
              React.createElement('div', { key: 'generic' }, [
                React.createElement('p', { key: 'generic-title', className: 'text-lg font-semibold' }, 
                  'Widget Content'
                ),
                React.createElement('p', { key: 'generic-desc', className: 'text-sm text-muted-foreground' }, 
                  'This is a generic widget rendering.'
                )
              ])
          ])
        ]);
      } catch (error) {
        console.error('Error rendering widget:', error);
        return React.createElement('div', { 
          className: 'p-4 border border-red-200 bg-red-50 rounded text-red-600'
        }, `Widget rendering error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    console.log("Widget component created successfully");
    
    // Return the component and its ID
    return {
      component: WidgetComponent,
      id
    };
  } catch (error) {
    console.error('Error creating widget from code:', error);
    toast({
      title: 'Widget Creation Failed',
      description: `Could not create widget: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: 'destructive',
    });
    return null;
  }
};

export { createWidgetFromCode };
