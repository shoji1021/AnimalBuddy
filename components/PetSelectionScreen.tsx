
import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { ZodiacAnimal } from '../types';
import { ZODIAC_ANIMALS } from '../constants';

const PetSelectionScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<ZodiacAnimal | null>(null);
  const context = useContext(GameContext);

  const handleStart = () => {
    if (name.trim() && selectedAnimal && context) {
      context.startGame(name.trim(), selectedAnimal);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">Welcome to Zodiac Partner AI</h1>
        <p className="text-lg text-gray-300 mb-8">Create your lifelong AI companion.</p>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">1. Choose Your Partner</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
            {ZODIAC_ANIMALS.map(({ name, emoji }) => (
              <button
                key={name}
                onClick={() => setSelectedAnimal(name)}
                className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                  selectedAnimal === name ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="text-4xl">{emoji}</div>
                <div className="text-sm mt-1">{name}</div>
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4">2. Give it a Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
            className="w-full max-w-sm mx-auto bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg text-center text-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 outline-none"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim() || !selectedAnimal}
          className="mt-8 px-8 py-4 bg-indigo-600 text-white font-bold text-xl rounded-lg shadow-lg transition-all duration-300 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transform hover:scale-105"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
};

export default PetSelectionScreen;
