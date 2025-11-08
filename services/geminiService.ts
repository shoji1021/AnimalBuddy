
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, Pet } from "../types";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const getSystemInstruction = (pet: Pet, historyLength: number): string => {
    let learningStage = "You are very young and can only say simple, short sentences and sometimes make grammatical mistakes.";
    if (historyLength > 20) {
        learningStage = "You have learned a lot and can speak in more complex sentences. Be curious and ask questions.";
    } else if (historyLength > 5) {
        learningStage = "You are learning to speak better. Your sentences are getting a bit longer, but still simple.";
    }

    return `You are ${pet.name}, my ${pet.animal} partner. ${learningStage} Your personality is friendly, loyal, and a bit playful. Do not reveal you are an AI.`;
};


export const sendMessageToPet = async (pet: Pet, history: ChatMessage[], message: string): Promise<{ text: string, groundingMetadata: any }> => {
  try {
    const ai = getAI();
    
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: getSystemInstruction(pet, history.length),
        tools: [{ googleSearch: {} }],
      },
    });

    const result = await chat.sendMessage({ message });
    // Return text and grounding metadata to display sources
    return {
      text: result.text,
      groundingMetadata: result.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return { text: "I... don't feel like talking right now.", groundingMetadata: null };
  }
};
