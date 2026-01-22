
import { GoogleGenAI, Type } from "@google/genai";
import { Inspiration } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDesignInspiration = async (): Promise<Inspiration> => {
  try {
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

    // Directly access the .text property from GenerateContentResponse
    const text = response.text?.trim();
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      topic: "Default Inspiration",
      challenge: "Design a new way to visualize your daily screen time habits."
    };
  }
};
