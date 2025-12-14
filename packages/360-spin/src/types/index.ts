/**
 * 360 Spin Types
 */

export interface SpinViewerProps {
  /** Array of image URLs or base64 data URLs for each frame */
  images: string[];
  /** Width of the viewer (default: '100%') */
  width?: number | string;
  /** Height of the viewer (default: 400) */
  height?: number | string;
  /** Drag sensitivity - pixels per frame change. Lower = faster rotation (default: 8) */
  sensitivity?: number;
  /** Reverse rotation direction (default: false) */
  reverse?: boolean;
  /** Callback when frame changes */
  onFrameChange?: (frame: number) => void;
  /** Theme for styling (default: 'light') */
  theme?: 'light' | 'dark';
  /** Additional CSS class name */
  className?: string;
}

export interface SpinViewerState {
  currentFrame: number;
  isDragging: boolean;
}

export interface SpinConfig {
  /** Drag sensitivity - pixels per frame change (default: 8) */
  sensitivity?: number;
}

// Generator types
export interface SpinGeneratorProps {
  apiKey: string;
  onGenerate?: (images: string[]) => void;
  onError?: (error: Error) => void;
  numFrames?: 8 | 12 | 16 | 24 | 36;
  width?: number | string;
  height?: number | string;
  showViewer?: boolean;
  background?: 'white' | 'transparent' | 'studio';
  quality?: 'standard' | 'hd';
  theme?: 'light' | 'dark';
  className?: string;
}

export interface SpinGeneratorState {
  sourceImage: string | null;
  generatedImages: string[];
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  productDescription: string | null;
}

export interface GenerationConfig {
  numFrames: number;
  style?: 'realistic' | 'artistic' | 'product';
  quality?: 'standard' | 'hd';
  background?: 'white' | 'transparent' | 'studio';
}

