/**
 * 360 Spin Types
 */

/** Trigger mode for starting animation */
export type SpinTrigger = 'hover' | 'click' | 'auto' | 'manual';

/** Rotation direction */
export type SpinDirection = 'clockwise' | 'counterclockwise';

export interface SpinViewerProps {
  /** Static image shown when not animating (optional - uses first frame if not provided) */
  staticImage?: string;
  /** Array of image URLs or base64 data URLs for each frame (animated sequence) */
  images: string[];
  /** Width of the viewer (default: '100%') */
  width?: number | string;
  /** Height of the viewer (default: 400) */
  height?: number | string;
  /** What triggers the spin animation (default: 'manual' - drag only) */
  trigger?: SpinTrigger;
  /** Frame rate for auto animation in FPS (default: 30) */
  frameRate?: number;
  /** Rotation direction (default: 'clockwise') */
  direction?: SpinDirection;
  /** Drag sensitivity - pixels per frame change. Lower = faster rotation (default: 8) */
  sensitivity?: number;
  /** Reverse drag direction (default: false) */
  reverse?: boolean;
  /** Enable drag-to-spin interaction (default: true) */
  enableDragSpin?: boolean;
  /** Callback when frame changes */
  onFrameChange?: (frame: number) => void;
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation ends */
  onAnimationEnd?: () => void;
  /** Theme for styling (default: 'light') */
  theme?: 'light' | 'dark';
  /** Additional CSS class name */
  className?: string;
}

export interface SpinViewerState {
  currentFrame: number;
  isDragging: boolean;
  isAnimating: boolean;
  isLoading: boolean;
  loadProgress: number;
}

export interface SpinConfig {
  /** Drag sensitivity - pixels per frame change (default: 8) */
  sensitivity?: number;
  /** Frame rate for auto animation (default: 30) */
  frameRate?: number;
  /** Rotation direction (default: 'clockwise') */
  direction?: SpinDirection;
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

