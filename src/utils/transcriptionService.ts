
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

    // Send to n8n webhook (GET request)
    const response = await fetch(
      `http://localhost:5678/webhook-test/${webhookId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from n8n:", errorData);
      throw new Error(
        errorData.message || `Server responded with ${response.status}`
      );
    }

    // Parse the response from n8n
    return await response.json();
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
