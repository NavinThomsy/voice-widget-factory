
import { ComponentType } from 'react';

export interface Widget {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
}

export interface WidgetCode {
  id: string;
  code: string;
}

export interface TranscriptionResponse {
  output: string;
  [key: string]: any;
}
