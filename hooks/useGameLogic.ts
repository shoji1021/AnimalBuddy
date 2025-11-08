
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
    
    const checkPetState = () => {
        const now = new Date();
        const lastFed = new Date(pet.lastFed);
        const birthDate = new Date(pet.birthDate);

        const hoursSinceFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
        const daysSinceFed = hoursSinceFed / 24;

        const monthsSinceBirth = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());

        let newStatus = pet.status;
        let nextGameState: GameState = 'PLAYING';

        if (daysSinceFed >= DEATH_THRESHOLD_DAYS) {
            nextGameState = 'GAMEOVER';
        } else if (daysSinceFed >= BEDRIDDEN_THRESHOLD_DAYS) {
            newStatus = 'BEDRIDDEN';
        } else if (daysSinceFed >= SICK_THRESHOLD_DAYS) {
            newStatus = 'SICK';
        } else {
            newStatus = 'HAPPY';
        }
        
        if (nextGameState !== 'GAMEOVER' && monthsSinceBirth >= LIFESPAN_MONTHS) {
            nextGameState = 'END_OF_LIFE';
        }
        
        setGameState(current => current !== nextGameState ? nextGameState : current);

        if (newStatus !== pet.status) {
            setPet(p => p ? { ...p, status: newStatus } : null);
        }
    };

    checkPetState(); // Run immediately on load or pet change
    const interval = setInterval(checkPetState, 60000); // Check every minute
    return () => clearInterval(interval); // Cleanup on unmount or re-run
  }, [pet, setPet, setGameState]);
};
