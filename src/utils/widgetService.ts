
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
    
    // Create a standalone component function that will render the widget content
    const WidgetComponent: React.FC<any> = (props) => {
      try {
        return React.createElement('div', { 
          className: 'widget-content p-4 h-full overflow-auto',
          key: id
        }, [
          // Create a display of the widget content
          React.createElement('div', { 
            className: 'bg-white rounded-md shadow-sm p-4 h-full overflow-auto',
            key: 'content',
            dangerouslySetInnerHTML: { __html: widgetCode }
          })
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
