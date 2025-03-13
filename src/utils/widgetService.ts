
import { toast } from '@/components/ui/use-toast';
import React from 'react';

// Create new widget from code string
const createWidgetFromCode = (
  widgetCode: string, 
  id: string
): { component: React.ComponentType<any>; id: string } | null => {
  try {
    // Extract the component code by removing the import and export statements
    const componentCode = widgetCode
      .replace(/import\s+.*?from\s+(['"]).*?\1;?/g, '')  // Remove import statements
      .replace(/export\s+default\s+\w+;?/g, '');  // Remove export default
    
    // Create a function body to evaluate the React component code
    const functionBody = `
      const React = arguments[0];
      ${componentCode}
      return StockWidget;
    `;
    
    // Use Function constructor to evaluate the code with React passed as an argument
    const componentConstructor = new Function(functionBody);
    const Component = componentConstructor(React);
    
    // Return the component and its ID
    return {
      component: Component,
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
