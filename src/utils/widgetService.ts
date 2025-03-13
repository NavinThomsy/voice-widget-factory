
import { toast } from '@/components/ui/use-toast';
import React from 'react';

// Create new widget from code string
const createWidgetFromCode = (
  widgetCode: string, 
  id: string
): { component: React.ComponentType<any>; id: string } | null => {
  try {
    console.log("Raw widget code:", widgetCode);
    
    // Clean the code - removing imports and exports
    let componentCode = widgetCode
      .replace(/import\s+.*?from\s+(['"]).*?\1;?/g, '')  // Remove import statements
      .replace(/export\s+default\s+\w+;?/g, '')  // Remove export default
      .trim();
    
    // Make sure we have valid JSX by ensuring we have a React component
    if (!componentCode.includes('const StockWidget') && !componentCode.includes('function StockWidget')) {
      throw new Error("Widget code must contain a StockWidget component");
    }
    
    console.log("Cleaned component code:", componentCode);
    
    // Create a function body that properly evaluates React JSX
    const functionBody = `
      try {
        const React = arguments[0];
        ${componentCode}
        return typeof StockWidget === 'function' ? StockWidget : null;
      } catch (error) {
        console.error("Error in widget code:", error);
        return null;
      }
    `;
    
    // Use Function constructor to evaluate the code with React passed as an argument
    const componentConstructor = new Function(functionBody);
    const Component = componentConstructor(React);
    
    if (!Component) {
      throw new Error("Component creation failed: Component is undefined or not a function");
    }
    
    console.log("Widget component created successfully");
    
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
