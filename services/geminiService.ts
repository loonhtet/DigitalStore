
import { GoogleGenAI } from "@google/genai";

// Standardizing Gemini API calls according to the provided senior engineer guidelines.
// Always use the API key directly from process.env.API_KEY.
export const getAIRecommendation = async (userQuery: string, availableProducts: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Nexus Store's AI Assistant. Your job is to recommend digital subscriptions based on user needs.
      
      Available Products:
      ${availableProducts}
      
      User says: "${userQuery}"
      
      Provide a helpful, friendly response. If they ask for something we don't have, politely suggest the closest alternative. Keep it concise.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    // Access the .text property directly, do not call it as a method.
    return response.text || "I couldn't process that request. How else can I help you?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI is thinking too hard right now. Try again later!";
  }
};
