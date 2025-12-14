/**
 * useSpinGenerator Hook - Generate 360° views from a single image using AI
 * Creates e-commerce quality 360° product views from a single product photo
 */

import { useState, useCallback } from 'react';
import { SpinGeneratorState, GenerationConfig } from '../types';

interface UseSpinGeneratorOptions {
  apiKey: string;
  onGenerate?: (images: string[]) => void;
  onError?: (error: Error) => void;
}

export function useSpinGenerator(options: UseSpinGeneratorOptions) {
  const { apiKey, onGenerate, onError } = options;

  const [state, setState] = useState<SpinGeneratorState>({
    sourceImage: null,
    generatedImages: [],
    isGenerating: false,
    progress: 0,
    currentStep: '',
    error: null,
    productDescription: null
  });

  const setSourceImage = useCallback((imageDataUrl: string) => {
    setState(prev => ({
      ...prev,
      sourceImage: imageDataUrl,
      generatedImages: [],
      error: null,
      productDescription: null
    }));
  }, []);

  const clearSourceImage = useCallback(() => {
    setState({
      sourceImage: null,
      generatedImages: [],
      isGenerating: false,
      progress: 0,
      currentStep: '',
      error: null,
      productDescription: null
    });
  }, []);

  // Analyze the product image first to get a consistent description
  const analyzeProduct = async (imageDataUrl: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a product photography expert. Describe the product for generating dynamic 360° product photos.

Provide a PRECISE description:
1. PRODUCT TYPE: Exact name (e.g., "white athletic running shoe with blue accents")
2. SHAPE: Overall 3D form and proportions
3. COLORS: Exact colors with locations (e.g., "white body, cyan blue trim lines, translucent blue sole")
4. MATERIALS: Surface textures (glossy, matte, mesh, leather, rubber, translucent)
5. KEY DETAILS: Logos, patterns, stitching, visible features
6. DISTINCTIVE ELEMENTS: What makes this product recognizable

Keep response under 150 words. Be specific about colors and materials.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this product precisely for 360° photography. Focus on colors, materials, and distinctive features.'
              },
              {
                type: 'image_url',
                image_url: { url: imageDataUrl, detail: 'high' }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  // Generate a single rotated view at a specific angle
  const generateRotatedView = async (
    description: string,
    angle: number,
    _totalFrames: number,
    _frameIndex: number,
    _background: string,
    quality: 'standard' | 'hd'
  ): Promise<string> => {
    // Dynamic 3D angle descriptions - product tilted and angled like premium product photography
    const getAngleDescription = (deg: number): string => {
      if (deg === 0) return 'front 3/4 view, product tilted 30° toward camera, showing top and front';
      if (deg === 45) return 'front-right 3/4 view, product angled to show front, right side, and top';
      if (deg === 90) return 'right side view, product tilted to show right side and partial top';
      if (deg === 135) return 'back-right 3/4 view, product angled to show back, right side, and top';
      if (deg === 180) return 'back 3/4 view, product tilted to show back and top';
      if (deg === 225) return 'back-left 3/4 view, product angled to show back, left side, and top';
      if (deg === 270) return 'left side view, product tilted to show left side and partial top';
      if (deg === 315) return 'front-left 3/4 view, product angled to show front, left side, and top';
      return `product rotated ${deg}° with dynamic 3/4 angle`;
    };

    const viewDescription = getAngleDescription(angle);

    // Premium e-commerce style prompt - dynamic angled shots with reflection
    const prompt = `Premium e-commerce product photography, ${viewDescription}.

PRODUCT: ${description}

STYLE:
- Dynamic floating angle, product tilted toward camera showing 3D form
- Pure white seamless background (#FFFFFF)
- Soft reflection/shadow on glossy white surface below product
- Professional studio lighting, soft and even
- Sharp focus, high detail, photorealistic
- Product centered, fills 60% of frame
- Clean, minimal, luxury e-commerce aesthetic
- Similar to Nike, Apple, or Adidas product photos`;

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality,
        response_format: 'b64_json',
        style: 'natural'
      })
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Image generation error: ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();
    const base64Image = imageData.data[0]?.b64_json;

    if (!base64Image) {
      throw new Error('No image data received from API');
    }

    return `data:image/png;base64,${base64Image}`;
  };

  const generate360View = useCallback(async (config: GenerationConfig = { numFrames: 8 }) => {
    if (!state.sourceImage) {
      const error = new Error('No source image provided');
      onError?.(error);
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      currentStep: 'Analyzing product...',
      error: null
    }));

    try {
      const { numFrames, quality = 'standard', background = 'white' } = config;

      // Step 1: Analyze the product image
      setState(prev => ({ ...prev, currentStep: 'Analyzing product details...', progress: 5 }));
      const productDescription = await analyzeProduct(state.sourceImage);
      setState(prev => ({ ...prev, productDescription, progress: 10 }));

      // Step 2: Generate each rotated view
      const generatedImages: string[] = [];
      const progressPerFrame = 90 / numFrames;

      for (let i = 0; i < numFrames; i++) {
        const angle = Math.round((360 / numFrames) * i);

        setState(prev => ({
          ...prev,
          currentStep: `Generating ${angle}° view (${i + 1}/${numFrames})...`,
          progress: 10 + (i * progressPerFrame)
        }));

        const imageUrl = await generateRotatedView(
          productDescription,
          angle,
          numFrames,
          i,
          background,
          quality
        );

        generatedImages.push(imageUrl);

        setState(prev => ({
          ...prev,
          progress: 10 + ((i + 1) * progressPerFrame),
          generatedImages: [...generatedImages] // Update with generated so far
        }));
      }

      setState(prev => ({
        ...prev,
        generatedImages,
        isGenerating: false,
        progress: 100,
        currentStep: 'Complete!'
      }));

      onGenerate?.(generatedImages);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Generation failed');
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message,
        currentStep: 'Error'
      }));
      onError?.(err);
    }
  }, [state.sourceImage, apiKey, onGenerate, onError]);

  return {
    ...state,
    setSourceImage,
    clearSourceImage,
    generate360View
  };
}

