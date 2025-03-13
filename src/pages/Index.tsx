import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import VoiceInput from '@/components/VoiceInput';
import Dashboard from '@/components/Dashboard';
import { sendTranscriptionToN8n } from '@/utils/transcriptionService';
import { createWidgetFromCode } from '@/utils/widgetService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Using the webhook ID provided by the user
const WEBHOOK_ID = 'e4095d4b-e25e-46c4-b156-65544cdee750';

interface Widget {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

const Index = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load widgets from localStorage on initial render
  useEffect(() => {
    const savedWidgetsCodes = localStorage.getItem('dashboard-widgets');
    
    if (savedWidgetsCodes) {
      try {
        const parsedData = JSON.parse(savedWidgetsCodes);
        
        // Skip if data is invalid or empty
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          return;
        }
        
        // Attempt to recreate each widget
        const recreatedWidgets = parsedData
          .map((item: { id: string; code: string }) => {
            const widget = createWidgetFromCode(item.code, item.id);
            return widget;
          })
          .filter(Boolean) as Widget[];
        
        if (recreatedWidgets.length > 0) {
          setWidgets(recreatedWidgets);
        }
      } catch (error) {
        console.error('Failed to restore widgets:', error);
      }
    }
  }, []);
  
  // Save widget codes to localStorage when widgets change
  useEffect(() => {
    // Since we can't directly stringify React components,
    // we would need to store the original code
    // For this demo, let's assume we're mocking this part
    const widgetCodes = widgets.map(widget => {
      // In a real implementation, we would store the original code
      // that was used to create the component
      return {
        id: widget.id,
        code: `// Placeholder for widget code for ID: ${widget.id}` 
      };
    });
    
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetCodes));
  }, [widgets]);
  
  // Handle voice transcription
  const handleTranscription = useCallback(async (transcription: string) => {
    setIsProcessing(true);
    toast({
      title: "Processing Your Request",
      description: `"${transcription}" is being processed...`,
    });
    
    try {
      console.log("Sending transcription to n8n:", transcription);
      
      // Send transcription to n8n
      const result = await sendTranscriptionToN8n(transcription, WEBHOOK_ID);
      
      if (result?.output) {
        console.log("Received widget code from n8n workflow:", result.output);
        
        // Display the widget code in a toast (this is also done in createWidgetFromCode now)
        toast({
          title: "Widget Code Received",
          description: "Creating widget from received code",
        });
        
        // Create a new widget from the returned code
        const widgetId = uuidv4();
        const widget = createWidgetFromCode(result.output, widgetId);
        
        if (widget) {
          console.log("Widget created successfully:", widgetId);
          
          // For weather widget, add weather-specific props
          const props = {
            location: "Vancouver",
            temperature: 6.88,
            feelsLike: 4.11,
            condition: "Moderate Rain",
            windSpeed: 4.12,
            humidity: 89,
            precipitation: 0.85  // Adding precipitation prop that might be needed
          };
          
          const widgetWithProps = {
            ...widget,
            props
          };
          
          // Add the new widget to the state
          setWidgets(prev => [...prev, widgetWithProps]);
          
          toast({
            title: "Widget Created",
            description: "New widget has been added to your dashboard.",
          });
        } else {
          console.error("Widget creation returned null");
          toast({
            title: "Widget Creation Failed",
            description: "Failed to create widget from the received code.",
            variant: "destructive",
          });
        }
      } else {
        console.error("No output received from n8n");
        toast({
          title: "Processing Failed",
          description: "No widget code was returned from the workflow.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing transcription:', error);
      toast({
        title: "Processing Failed",
        description: `Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  // Handle manual widget creation
  const handleDisplayWidget = async () => {
    // This would be similar to handleTranscription but for manual trigger
    // In a real implementation, you might have a default widget or fetch the latest
    toast({
      title: "Display Widget Clicked",
      description: "This would fetch and display the latest widget from your n8n workflow.",
    });
  };
  
  // Handle widget removal
  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from your dashboard.",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toaster />
      <Header onDisplayWidgetClick={handleDisplayWidget} isProcessing={isProcessing} />
      <div className="flex-1 flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full">
        <VoiceInput onTranscription={handleTranscription} isProcessing={isProcessing} />
        <Dashboard widgets={widgets} onRemoveWidget={handleRemoveWidget} />
      </div>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border/40">
        <p>Voice Widget Dashboard • Built with React and GridStack.js</p>
      </footer>
    </div>
  );
};

export default Index;
