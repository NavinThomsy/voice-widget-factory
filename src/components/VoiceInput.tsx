
import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import '../styles/VoiceInput.css';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

// Extended SpeechRecognitionEvent interface to include error property
interface ExtendedSpeechRecognitionEvent extends SpeechRecognitionEvent {
  error?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsAvailable(true);
    } else {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const startListening = () => {
    if (isProcessing) {
      toast({
        title: "Processing Previous Request",
        description: "Please wait while processing your previous request.",
      });
      return;
    }

    if (isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening for your widget request.",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      if (confidence > 0.5) {
        onTranscription(transcript);
      } else {
        toast({
          title: "Couldn't hear that clearly",
          description: "Please try speaking again more clearly.",
          variant: "destructive",
        });
      }
      
      setIsListening(false);
    };

    recognition.onerror = (event: ExtendedSpeechRecognitionEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: `Error: ${event.error || 'Unknown'}. Please try again.`,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!isAvailable) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6">
      <div className="mic-button-container">
        <button
          onClick={toggleListening}
          disabled={!isAvailable || isProcessing}
          className={`mic-button ${isListening ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          <Mic className={`h-6 w-6 ${isListening ? 'animate-pulse-light' : ''}`} />
        </button>
        {isListening && (
          <>
            <div className="mic-wave" style={{ animationDelay: '0s' }}></div>
            <div className="mic-wave" style={{ animationDelay: '0.5s' }}></div>
            <div className="mic-wave" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {isListening 
          ? "Listening..." 
          : isProcessing 
            ? "Processing..." 
            : "Tap to speak"}
      </p>
    </div>
  );
};

export default VoiceInput;
