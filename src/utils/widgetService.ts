
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
      title: "Widget Code Received",
      description: `Received widget code (${widgetCode.length} characters)`,
    });
    
    // Extract the actual component code from the code blocks (if present)
    let cleanedCode = widgetCode;
    if (widgetCode.startsWith('```') && widgetCode.endsWith('```')) {
      cleanedCode = widgetCode.replace(/^```(?:tsx|jsx)?/, '').replace(/```$/, '').trim();
    }
    
    // Create a function that returns the evaluated component
    const evalComponentCode = new Function('React', `
      ${cleanedCode}
      return WeatherWidget;
    `);
    
    // Execute the function with React as parameter
    const EvaluatedComponent = evalComponentCode(React);
    
    // Create a wrapper component that will render the evaluated component
    const WidgetComponent: React.FC<any> = (props) => {
      try {
        // If we successfully evaluated the component, render it with props
        if (EvaluatedComponent && typeof EvaluatedComponent === 'function') {
          return React.createElement(EvaluatedComponent, props);
        }
        
        // Fallback if component evaluation failed
        return React.createElement('div', { 
          className: 'p-4 border border-yellow-200 bg-yellow-50 rounded',
        }, "Widget could not be rendered properly");
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
