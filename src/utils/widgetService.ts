
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

// Create new widget from code string
const createWidgetFromCode = (
  widgetCode: string, 
  id: string
): { component: React.ComponentType<any>; id: string } | null => {
  try {
    // Create a function body to evaluate the React component code
    const functionBody = `
      ${widgetCode}
      return { default: StockWidget };
    `;
    
    // Use Function constructor to evaluate the code
    const componentModule = new Function('React', functionBody)(React);
    
    // Return the component and its ID
    return {
      component: componentModule.default,
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
