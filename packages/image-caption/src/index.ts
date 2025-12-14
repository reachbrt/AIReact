/**
 * @aireact/image-caption
 * AI image captioning with GPT-4 Vision for React
 */

// Components
export { ImageCaption } from './components';

// Hooks
export { useImageCaption } from './hooks';

// Types
export type { ImageCaptionProps, ImageCaptionConfig, CaptionResult } from './types';

// Package version
export const REACTAI_IMAGE_CAPTION_VERSION = '1.0.0';
console.log(
  `%c @aireact/image-caption v${REACTAI_IMAGE_CAPTION_VERSION} `,
  'background: #8B5CF6; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
);

