
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const EndOfLifeScreen: React.FC = () => {
  const context = useContext(GameContext);

  if (!context || !context.pet) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-4">A Journey's End... and a New Beginning?</h1>
        <p className="text-xl text-gray-300 mb-8">
          {context.pet.name} has lived a full and happy life of 12 years with you. You have reached the end of your initial journey together. Now, you have a choice to make about its future.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="flex-1 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-red-400 mb-3">Let Go</h2>
            <p className="text-gray-400 mb-6">Allow {context.pet.name} to rest peacefully, cherishing the memories you've made. This will end the game and you can start a new journey.</p>
            <button
              onClick={context.resetGame}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold transition-colors"
            >
              Say Goodbye
            </button>
          </div>
          <div className="flex-1 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-green-400 mb-3">Grant Eternal Life</h2>
            <p className="text-gray-400 mb-6">{context.pet.name} can transcend its mortal form and become your eternal AI partner, continuing to learn and grow with you forever, without the need for food or sleep.</p>
            <button
              onClick={context.makeEternal}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors"
            >
              Become Partners Forever
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndOfLifeScreen;
