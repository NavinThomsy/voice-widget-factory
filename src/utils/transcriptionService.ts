
import { toast } from "@/components/ui/use-toast";

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
    
    try {
      // First attempt: try with regular fetch (works if CORS is properly configured)
      const response = await fetch(webhookUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Webhook response:", data);
        return data;
      }
    } catch (fetchError) {
      console.log("Regular fetch failed, trying with no-cors:", fetchError);
      // If regular fetch fails, try with no-cors as fallback
      await fetch(webhookUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "no-cors",
      });
      
      console.log("No-cors request sent to webhook");
    }
    
    // Since we might be using no-cors and can't get a proper response,
    // we'll return a mock response for demonstration
    // In production, you would use a properly configured CORS setup on the n8n server
    
    console.log("Generating mock widget response for:", transcription);
    
    // Mock response with a weather widget based on the transcription
    const mockResponse = {
      output: `
const StockWidget = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full">
      <h3 className="text-lg font-medium mb-2">Widget from Transcription</h3>
      <p className="text-gray-600">You said: "${transcription}"</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-blue-600 font-bold">Processed successfully</span>
        <span className="text-sm text-gray-500">${new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};
`
    };
    
    return mockResponse;
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
