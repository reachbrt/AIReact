/**
 * ImageCaption Demo Component
 */

import React, { useState } from 'react';
import { ImageCaption } from '@aireact/image-caption';

interface ImageCaptionDemoProps {
  apiKey: string;
}

export const ImageCaptionDemo: React.FC<ImageCaptionDemoProps> = ({ apiKey }) => {
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400');
  const [caption, setCaption] = useState<string | null>(null);

  const sampleImages = [
    { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400', label: 'Cat' },
    { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', label: 'Dog' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', label: 'Mountain' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Image Captioning</h3>
        <p className="text-slate-500 text-sm">
          Upload or select an image to generate AI-powered captions using GPT-4 Vision.
        </p>
      </div>

      {/* Sample Images */}
      <div className="flex justify-center gap-4">
        {sampleImages.map((img) => (
          <button
            key={img.url}
            onClick={() => {
              setImageUrl(img.url);
              setCaption(null);
            }}
            className={`p-1 rounded-lg border-2 transition-all ${
              imageUrl === img.url ? 'border-primary-500 shadow-lg' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <img src={img.url} alt={img.label} className="w-20 h-20 object-cover rounded" />
          </button>
        ))}
      </div>

      {/* Image Caption Component */}
      <div className="flex justify-center">
        <ImageCaption
          src={imageUrl}
          apiKey={apiKey}
          provider="openai"
          onCaptionGenerated={(result) => setCaption(result.caption)}
          showCaption={true}
          className="max-w-md"
        />
      </div>

      {/* Generated Caption */}
      {caption && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100">
          <p className="text-slate-700 text-center">
            <span className="font-semibold text-primary-600">Generated Caption:</span> {caption}
          </p>
        </div>
      )}
    </div>
  );
};

