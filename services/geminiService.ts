
import { GoogleGenAI, Type } from "@google/genai";
import { Inspiration } from "../types";

export const getDesignInspiration = async (): Promise<Inspiration> => {
  try {
    // Initializing inside the function to avoid early ReferenceErrors with process.env
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a creative design challenge for a communication design student who loves typography, UX/UI, 3D, and web development. Keep it brief and inspiring.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "The theme of the challenge" },
            challenge: { type: Type.STRING, description: "A specific task or prompt" }
          },
          required: ["topic", "challenge"]
        }
      }
    });

    const text = response.text?.trim();
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("Empty response");
  } catch (error) {
    console.warn("Gemini Error - using fallback:", error);
    return {
      topic: "System Design Challenge",
      challenge: "Create a modular design system for a futuristic transport hub."
    };
  }
};
