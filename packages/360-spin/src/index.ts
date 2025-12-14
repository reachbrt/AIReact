/**
 * @aireact/360-spin
 * Interactive 360° product viewer for React
 */

export { SpinViewer, SpinGenerator } from './components';
export { use360Spin, useSpinGenerator } from './hooks';
export type {
  SpinViewerProps,
  SpinViewerState,
  SpinConfig,
  SpinGeneratorProps,
  SpinGeneratorState,
  GenerationConfig
} from './types';

export const REACTAI_360_SPIN_VERSION = '1.0.0';
console.log(`%c @aireact/360-spin v${REACTAI_360_SPIN_VERSION} `, 'background: #EC4899; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

