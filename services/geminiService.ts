
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from '@google/genai';
import { AnalysisResult, MapGroundingChunk, ShopResult } from '../types';

export const analyzeImageAndFindShops = async (
  imageBase64: string,
  mimeType: string,
  location: { latitude: number; longitude: number } | null
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = {
    parts: [
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
      {
        text: `Identify exactly what this item is. Then, find shops within walking or short driving distance of my current location that sell this item or items very similar to it. Return a helpful description of the item and mention the best stores found.`,
      },
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: location ? {
            latitude: location.latitude,
            longitude: location.longitude,
          } : undefined,
        },
      },
    },
  });

  const description = response.text || "I found this item, but couldn't generate a description.";
  
  // Extract shops from grounding chunks
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as MapGroundingChunk[] | undefined;
  const shops: ShopResult[] = [];

  if (chunks) {
    chunks.forEach(chunk => {
      if (chunk.maps) {
        shops.push({
          title: chunk.maps.title,
          uri: chunk.maps.uri,
          snippet: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0],
        });
      }
    });
  }

  return {
    description,
    shops,
  };
};
