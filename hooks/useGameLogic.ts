
import React, { useEffect } from 'react';
import { Pet, GameState } from '../types';

const SICK_THRESHOLD_DAYS = 3;
const BEDRIDDEN_THRESHOLD_DAYS = 5;
const DEATH_THRESHOLD_DAYS = 7;
const LIFESPAN_MONTHS = 12;

export const useGameLogic = (
  pet: Pet | null,
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  useEffect(() => {
    if (!pet) {
        setGameState('SELECTING');
        return;
    };
    if (pet.status === 'ETERNAL') {
        setGameState('PLAYING');
        return;
    }
    
    const interval = setInterval(() => {
      const now = new Date();
      const lastFed = new Date(pet.lastFed);
      const birthDate = new Date(pet.birthDate);

      const hoursSinceFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
      const daysSinceFed = hoursSinceFed / 24;

      const monthsSinceBirth = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());

      let newStatus = pet.status;
      if (daysSinceFed >= DEATH_THRESHOLD_DAYS) {
        setGameState('GAMEOVER');
        return; // Stop further processing
      } else if (daysSinceFed >= BEDRIDDEN_THRESHOLD_DAYS) {
        newStatus = 'BEDRIDDEN';
      } else if (daysSinceFed >= SICK_THRESHOLD_DAYS) {
        newStatus = 'SICK';
      } else {
        newStatus = 'HAPPY';
      }
      
      if (newStatus !== pet.status) {
        setPet(p => p ? { ...p, status: newStatus } : null);
      }

      if (monthsSinceBirth >= LIFESPAN_MONTHS) {
        setGameState('END_OF_LIFE');
      } else {
        setGameState('PLAYING');
      }

    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pet, setPet, setGameState]);
};
