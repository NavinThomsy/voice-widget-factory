
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface HeaderProps {
  onDisplayWidgetClick: () => void;
  isProcessing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDisplayWidgetClick, isProcessing }) => {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border/40">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold mr-2">Voice Widget Dashboard</h1>
        <span className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5">
          Beta
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onDisplayWidgetClick}
          disabled={isProcessing}
          className="bg-primary text-white rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          <span>Display Widget</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
