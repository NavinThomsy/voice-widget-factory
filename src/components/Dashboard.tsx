
import React, { useEffect, useRef, useState } from 'react';
import { GridStack, GridStackNode } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import { X } from 'lucide-react';
import EmptyState from './EmptyState';

// Define our widget type
interface Widget {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

interface DashboardProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ widgets, onRemoveWidget }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstanceRef = useRef<GridStack | null>(null);
  const [isGridInitialized, setIsGridInitialized] = useState(false);

  // Initialize GridStack
  useEffect(() => {
    if (!gridRef.current) return;

    // Only initialize once
    if (!gridInstanceRef.current) {
      const options = {
        float: true,
        column: 12,
        cellHeight: 80,
        minRow: 1,
        margin: 10,
        disableOneColumnMode: false,
        animate: true,
        resizable: {
          handles: 'e,se,s,sw,w'
        }
      };

      gridInstanceRef.current = GridStack.init(options, gridRef.current);
      setIsGridInitialized(true);
    }

    return () => {
      if (gridInstanceRef.current) {
        gridInstanceRef.current.destroy(false);
        gridInstanceRef.current = null;
      }
    };
  }, []);

  // Add new widgets to the grid
  useEffect(() => {
    if (!isGridInitialized || !gridInstanceRef.current) return;
    
    const grid = gridInstanceRef.current;

    // Get existing widget IDs in the grid
    const existingItems = grid.getGridItems().map(el => el.getAttribute('data-widget-id'));
    
    // Add new widgets that aren't already in the grid
    widgets.forEach((widget, index) => {
      if (!existingItems.includes(widget.id)) {
        const node: GridStackNode = {
          x: (index % 3) * 4, // position widgets in 3 columns
          y: Math.floor(index / 3) * 4, // stack vertically
          w: 4,
          h: 4,
          id: widget.id,
        };
        
        const el = document.createElement('div');
        el.setAttribute('data-widget-id', widget.id);
        
        grid.addWidget(el, node);
        
        // Render the React component inside the grid item
        renderWidgetContent(el, widget);
      }
    });
  }, [widgets, isGridInitialized]);

  // Render a widget's content inside a grid item
  const renderWidgetContent = (element: HTMLElement, widget: Widget) => {
    if (!element) return;
    
    // Clear existing content
    element.innerHTML = '';
    
    // Create container for React component and close button
    const container = document.createElement('div');
    container.className = 'grid-stack-item-content p-4 relative';
    element.appendChild(container);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-2 right-2 p-1 bg-white/80 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 shadow-sm z-10 transition-all duration-200';
    closeBtn.setAttribute('aria-label', 'Remove widget');
    closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      onRemoveWidget(widget.id);
    };
    container.appendChild(closeBtn);
    
    // Create container for the actual widget content
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'widget-container h-full flex flex-col';
    container.appendChild(widgetContainer);
    
    // Render the React component
    const Component = widget.component;
    const props = widget.props || {};
    
    try {
      const reactElement = React.createElement(Component, props);
      const root = ReactDOM.createRoot(widgetContainer);
      root.render(reactElement);
    } catch (error) {
      console.error('Error rendering widget:', error);
      widgetContainer.innerHTML = `<div class="text-red-500">Error loading widget</div>`;
    }
  };

  return (
    <div className="grid-container flex-1 overflow-auto">
      {widgets.length === 0 ? (
        <EmptyState />
      ) : (
        <div ref={gridRef} className="grid-stack p-4 min-h-[400px]"></div>
      )}
    </div>
  );
};

export default Dashboard;
