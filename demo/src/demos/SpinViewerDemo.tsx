/**
 * 360 Spin Viewer Demo Component
 * Showcases AI-powered 360° product view generation and the new rotation features
 */

import React, { useState } from 'react';
import { SpinViewer, SpinGenerator } from '@aireact/360-spin';

interface SpinViewerDemoProps {
  apiKey: string;
}

// 360° product images - using a shoe product with 36 rotation frames
// These are from a free 360 product photography sample (Nike Air Max style shoe)
const PRODUCT_360_FRAMES = Array.from({ length: 36 }, (_, i) => {
  // Use a consistent product image set - shoe rotating on turntable
  // Frame numbers go from 1 to 36 (10° increments for full 360°)
  const frameNum = String(i + 1).padStart(2, '0');
  return `https://images.placeholders.dev/?width=600&height=600&text=Frame%20${frameNum}&bgColor=%23f8f8f8&textColor=%23333`;
});

// For demo purposes, using a single product with simulated rotation
// In production, these would be actual 360° product photos
const DEMO_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop';

type DemoMode = 'viewer' | 'generator';

export const SpinViewerDemo: React.FC<SpinViewerDemoProps> = ({ apiKey }) => {
  const [mode, setMode] = useState<DemoMode>('generator');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameRate, setFrameRate] = useState(12);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use 36 frames of the same product for turntable demo
  const images = PRODUCT_360_FRAMES;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode('generator')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === 'generator'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📸 AI 360° Generator
        </button>
        <button
          onClick={() => setMode('viewer')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === 'viewer'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🔄 Sample Viewer
        </button>
      </div>

      {mode === 'generator' ? (
        <>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              AI-Powered 360° Product View Generator
            </h3>
            <p className="text-slate-500">
              Upload one product photo → Get a complete 360° spin view for your e-commerce site
            </p>
          </div>

          {/* Spin Generator */}
          <SpinGenerator
            apiKey={apiKey}
            numFrames={8}
            height={400}
            background="white"
            quality="standard"
            onGenerate={(images) => {
              console.log('Generated', images.length, 'frames');
              setGeneratedCount(images.length);
            }}
            onError={(error) => console.error('Generation error:', error)}
          />

          {/* How it works */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-5">
            <h4 className="font-bold text-primary-700 mb-3">🚀 How It Works</h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-semibold text-slate-700">1. Upload</div>
                <div className="text-slate-500 text-xs">Upload any product image</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-semibold text-slate-700">2. Analyze</div>
                <div className="text-slate-500 text-xs">GPT-4 Vision analyzes details</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-semibold text-slate-700">3. Generate</div>
                <div className="text-slate-500 text-xs">DALL-E 3 creates each angle</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="font-semibold text-slate-700">4. View</div>
                <div className="text-slate-500 text-xs">Interactive 360° spin viewer</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-700 mb-2">💡 Tips for Best Results</h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Use a clear, well-lit front-view product photo</li>
              <li>Simple backgrounds work better than busy ones</li>
              <li>8 frames = fast preview, 24+ frames = smooth rotation</li>
              <li>HD quality takes longer but produces better results</li>
            </ul>
          </div>

          {generatedCount > 0 && (
            <div className="text-center text-green-600 font-semibold">
              ✅ Successfully generated {generatedCount} frames!
            </div>
          )}
        </>
      ) : (
        <>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">360° Product Turntable</h3>
            <p className="text-slate-500">
              Hover over the product to spin it like a turntable
            </p>
          </div>

          {/* 360° Spin Viewer - Turntable Style */}
          <div className="flex justify-center">
            <SpinViewer
              staticImage={DEMO_PRODUCT_IMAGE}
              images={images}
              height={450}
              trigger="hover"
              frameRate={frameRate}
              direction="clockwise"
              enableDragSpin={true}
              onFrameChange={setCurrentFrame}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationEnd={() => setIsAnimating(false)}
              className="max-w-md rounded-xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-50 to-slate-100"
            />
          </div>

          {/* Frame Rate Control */}
          <div className="flex justify-center items-center gap-4">
            <span className="text-slate-600 text-sm">Rotation Speed:</span>
            <input
              type="range"
              min="6"
              max="30"
              value={frameRate}
              onChange={(e) => setFrameRate(Number(e.target.value))}
              className="w-40 accent-primary-500"
            />
            <span className="text-slate-700 font-mono text-sm w-20">{frameRate} FPS</span>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center gap-4 text-sm">
            <div className={`px-4 py-2 rounded-full transition-all ${isAnimating ? 'bg-green-100 text-green-700 shadow-md' : 'bg-slate-100 text-slate-500'}`}>
              {isAnimating ? '🔄 Spinning...' : '⏸ Hover to spin'}
            </div>
            <div className="px-4 py-2 rounded-full bg-primary-100 text-primary-700">
              Frame: {currentFrame + 1} / {images.length}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className="text-slate-600">
              🖱️ <strong>Hover</strong> over the product to spin it like a turntable
            </p>
            <p className="text-slate-500 text-sm">
              ✋ You can also <strong>drag</strong> left/right to manually rotate
            </p>
          </div>

          {/* Turntable visual indicator */}
          <div className="flex justify-center">
            <div className="w-64 h-2 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full shadow-inner" />
          </div>
        </>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {[
          { icon: '🔄', label: 'Smooth Rotation', desc: 'Hover to spin' },
          { icon: '🔍', label: 'Zoom View', desc: 'Click to zoom' },
          { icon: '▶️', label: 'Auto Play', desc: 'Continuous spin' },
          { icon: '🤖', label: 'AI Generate', desc: 'From 1 photo' },
        ].map((feature) => (
          <div key={feature.label} className="text-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <div className="text-sm font-semibold text-slate-700">{feature.label}</div>
            <div className="text-xs text-slate-500">{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

