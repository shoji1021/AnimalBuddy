
import React, { useContext } from 'react';
import { GameContext } from './context/GameContext';
import PetSelectionScreen from './components/PetSelectionScreen';
import GameScreen from './components/GameScreen';
import EndOfLifeScreen from './components/EndOfLifeScreen';

const App: React.FC = () => {
  const context = useContext(GameContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { gameState } = context;

  const renderContent = () => {
    switch (gameState) {
      case 'SELECTING':
        return <PetSelectionScreen />;
      case 'PLAYING':
        return <GameScreen />;
      case 'END_OF_LIFE':
        return <EndOfLifeScreen />;
      case 'GAMEOVER':
         return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-xl mb-8">Your partner has passed away.</p>
            <button
              onClick={context.resetGame}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-semibold transition-colors"
            >
              Start a New Journey
            </button>
          </div>
        );
      default:
        return <PetSelectionScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
