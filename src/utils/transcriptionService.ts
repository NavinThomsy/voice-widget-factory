
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
    
    // Use no-cors mode to avoid CORS issues with the webhook
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "no-cors", // Add this to handle CORS issues
    });

    // Since we're using no-cors, we won't get a proper JSON response
    // For demo purposes, simulate a successful response
    // In a real app, you'd need a proper CORS setup on the n8n server
    
    console.log("Webhook request sent successfully");
    
    // For demo purposes, we'll return a mock response
    // This would come from n8n in a real scenario with proper CORS
    const mockResponse = {
      output: `
const StockWidget = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full">
      <h3 className="text-lg font-medium mb-2">Stock Widget</h3>
      <p className="text-gray-600">Transcription: "${transcription}"</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-green-600 font-bold">+2.4%</span>
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
