
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Pet, GameState, ZodiacAnimal, ChatMessage } from '../types';
import { useGameLogic } from '../hooks/useGameLogic';
import { sendMessageToPet } from '../services/geminiService';

interface GameContextProps {
  pet: Pet | null;
  gameState: GameState;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  startGame: (name: string, animal: ZodiacAnimal) => void;
  feedPet: () => void;
  sendMessage: (message: string) => Promise<void>;
  makeEternal: () => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [gameState, setGameState] = useState<GameState>('SELECTING');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const savedPet = localStorage.getItem('pet');
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedPet) {
        const parsedPet: Pet = JSON.parse(savedPet);
        setPet(parsedPet);
        setGameState(parsedPet.status === 'ETERNAL' ? 'PLAYING' : 'SELECTING'); // Will be updated by game logic hook
        if(savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
      }
    } catch (error) {
      console.error("Failed to load game from localStorage", error);
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (pet) {
      try {
        localStorage.setItem('pet', JSON.stringify(pet));
      } catch (error) {
        console.error("Failed to save pet state", error);
      }
    }
    if(chatHistory.length > 0) {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch(error) {
             console.error("Failed to save chat history", error);
        }
    }
  }, [pet, chatHistory]);

  const startGame = (name: string, animal: ZodiacAnimal) => {
    const newPet: Pet = {
      name,
      animal,
      birthDate: new Date().toISOString(),
      lastFed: new Date().toISOString(),
      status: 'HAPPY',
    };
    setPet(newPet);
    setGameState('PLAYING');
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  const feedPet = () => {
    setPet(prev => prev ? { ...prev, lastFed: new Date().toISOString(), status: 'HAPPY' } : null);
     sendMessage("Yum, thanks for the food!");
  };

  const makeEternal = () => {
    setPet(prev => prev ? { ...prev, status: 'ETERNAL' } : null);
    setGameState('PLAYING');
  };

  const resetGame = () => {
    localStorage.clear();
    setPet(null);
    setChatHistory([]);
    setGameState('SELECTING');
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!pet) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Handle object with text and groundingMetadata
      const response = await sendMessageToPet(pet, [...chatHistory, userMessage], message);
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }], groundingMetadata: response.groundingMetadata };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "I'm feeling a bit under the weather..." }] };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [pet, chatHistory]);

  useGameLogic(pet, setPet, setGameState);

  return (
    <GameContext.Provider value={{ pet, gameState, chatHistory, isLoading, startGame, feedPet, sendMessage, makeEternal, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
