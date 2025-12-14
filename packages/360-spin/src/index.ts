/**
 * @aireact/360-spin
 * Interactive 360° product viewer for React
 *
 * Features:
 * - Auto-rotation on hover/click/auto trigger
 * - Drag-to-spin interaction (mouse & touch)
 * - Static image + animated frames pattern
 * - requestAnimationFrame-based smooth rotation
 * - Configurable frame rate and direction
 */

export { SpinViewer, SpinGenerator } from './components';
export { use360Spin, useSpinGenerator } from './hooks';
export type { Use360SpinOptions } from './hooks/use360Spin';
export type {
  SpinViewerProps,
  SpinViewerState,
  SpinConfig,
  SpinTrigger,
  SpinDirection,
  SpinGeneratorProps,
  SpinGeneratorState,
  GenerationConfig
} from './types';

export const REACTAI_360_SPIN_VERSION = '1.0.2';
console.log(`%c @aireact/360-spin v${REACTAI_360_SPIN_VERSION} `, 'background: #EC4899; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

