
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TranscriptionResult {
  transcription: string;
  confidence: number;
  timestamp: string;
}

const sendTranscriptionToN8n = async (
  transcription: string,
  webhookId: string
): Promise<{ output: string } | null> => {
  try {
    // Create query parameters with transcription data
    const queryParams = new URLSearchParams({
      transcription,
      confidence: "0.95", // Example confidence value
      timestamp: new Date().toISOString(),
    }).toString();

    // Construct the webhook URL
    const webhookUrl = `http://localhost:5678/webhook/${webhookId}?${queryParams}`;
    
    console.log("Sending transcription to webhook:", webhookUrl);
    
    // Send the request to N8N webhook
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error("Error response from webhook:", response.status, response.statusText);
      throw new Error(`Error response from webhook: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    console.log("Webhook response data:", data);
    
    // Store in Supabase for history
    if (data && data.output) {
      try {
        const { error } = await supabase
          .from('widget_history')
          .insert({
            transcription: transcription,
            widget_code: data.output,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error("Error storing widget in Supabase:", error);
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error sending transcription to n8n:", error);
    toast({
      title: "Error",
      description: `Failed to process your request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      variant: "destructive",
    });
    return null;
  }
};

export { sendTranscriptionToN8n };
export type { TranscriptionResult };
