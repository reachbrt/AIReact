/**
 * 360 Spin Viewer Demo Component
 * Showcases AI-powered 360° product view generation
 */

import React, { useState } from 'react';
import { SpinViewer, SpinGenerator } from '@aireact/360-spin';

interface SpinViewerDemoProps {
  apiKey: string;
}

// Generate sample 360 images (using placeholder images)
const generateSpinImages = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/product${i + 1}/600/600`
  );
};

type DemoMode = 'viewer' | 'generator';

export const SpinViewerDemo: React.FC<SpinViewerDemoProps> = ({ apiKey }) => {
  const [mode, setMode] = useState<DemoMode>('generator');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const images = generateSpinImages(12);

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
            <h3 className="text-xl font-bold text-slate-800 mb-2">360° Product Viewer</h3>
            <p className="text-slate-500">
              E-commerce style 360° viewer with hover rotation
            </p>
          </div>

          {/* Spin Viewer */}
          <div className="flex justify-center">
            <SpinViewer
              images={images}
              height={400}
              onFrameChange={setCurrentFrame}
              autoPlay={isAutoPlaying}
              autoPlaySpeed={100}
              enableZoom={true}
              showControls={true}
              showProgress={true}
              className="max-w-lg rounded-xl overflow-hidden shadow-xl"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-5 py-2.5 rounded-lg transition-colors font-medium ${
                isAutoPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAutoPlaying ? '⏸ Stop' : '▶ Auto Rotate'}
            </button>
          </div>

          {/* Frame Thumbnails */}
          <div className="flex justify-center gap-1.5 flex-wrap max-w-lg mx-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFrame(idx)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  currentFrame === idx
                    ? 'border-primary-500 ring-2 ring-primary-300 scale-110'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-slate-500">
            <p>🖱️ Move cursor over image to rotate • 🔍 Click zoom button to zoom in</p>
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

