import { GoogleGenAI, Type } from "@google/genai";
import { CharacterMetadata } from "../types";

const apiKey = process.env.API_KEY;

// Fallback data in case API Key is missing or errors (for smooth demo experience if key is invalid)
const MOCK_DATA: CharacterMetadata = {
  character: "猫",
  pinyin: "māo",
  definition: "cat",
  exampleSentence: "这只小猫真可爱！",
  exampleTranslation: "This little cat is so cute!"
};

export const fetchCharacterMetadata = async (character: string): Promise<CharacterMetadata> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    if (character === '猫') return MOCK_DATA;
    return { ...MOCK_DATA, character, definition: "Definition unavailable (No API Key)" };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide fun and friendly information for the Chinese character: "${character}". 
      Return the Pinyin, a simple English definition, a natural and colloquial Chinese example sentence (something a friend would say in daily life, keep it simple), and the English translation of that sentence.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            character: { type: Type.STRING },
            pinyin: { type: Type.STRING },
            definition: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
            exampleTranslation: { type: Type.STRING },
          },
          required: ["character", "pinyin", "definition", "exampleSentence", "exampleTranslation"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as CharacterMetadata;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};