
import React from 'react';
import { Mic } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-fade-in">
      <div className="bg-muted/50 rounded-full p-6 mb-6">
        <Mic className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-3">Your dashboard is empty</h3>
      <p className="text-muted-foreground max-w-md mb-1">
        Tap the microphone button above and say "weather", "stock price", "calendar", or "to-do" to create widgets.
      </p>
      <p className="text-muted-foreground max-w-md">
        Or click the "Display Widget" button to add the latest widget from your n8n workflow.
      </p>
    </div>
  );
};

export default EmptyState;
