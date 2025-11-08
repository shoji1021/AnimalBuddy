
import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { GameContext } from '../context/GameContext';
import ChatInterface from './ChatInterface';
import { ZODIAC_ANIMALS } from '../constants';

const CameraView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert("Could not access camera. Please ensure permissions are granted.");
                onClose();
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <button onClick={onClose} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 leading-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

const PetDisplay: React.FC = () => {
    const { pet } = useContext(GameContext)!;
    if (!pet) return null;

    const petEmoji = ZODIAC_ANIMALS.find(z => z.name === pet.animal)?.emoji || '🐾';
    
    const statusEffects: {[key: string]: string} = {
        HAPPY: 'animate-bounce',
        SICK: 'opacity-70 animate-pulse',
        BEDRIDDEN: 'opacity-50 grayscale',
        ETERNAL: 'glow-shadow'
    };
    
    const statusEmoji: {[key: string]: string} = {
        HAPPY: '😊',
        SICK: '🤒',
        BEDRIDDEN: '😴',
        ETERNAL: '✨'
    };

    return (
        <div className="text-center p-4 bg-gray-800 rounded-t-lg">
            <style>{`.glow-shadow { filter: drop-shadow(0 0 10px #f0f8ff) drop-shadow(0 0 20px #a7c7e7); }`}</style>
            <div className={`text-8xl transition-all duration-500 ${statusEffects[pet.status]}`} style={{ animationDuration: pet.status === 'HAPPY' ? '2s' : '1.5s'}}>{petEmoji}</div>
            <h2 className="text-3xl font-bold mt-2">{pet.name}</h2>
            <p className="text-indigo-400 capitalize">{pet.animal}</p>
            <div className="mt-2 text-2xl">{statusEmoji[pet.status]} <span className="text-lg">{pet.status}</span></div>
        </div>
    );
};

const StatusBar: React.FC = () => {
    const { pet } = useContext(GameContext)!;
    const [age, setAge] = useState("Calculating...");
    const [hunger, setHunger] = useState(100);

    useEffect(() => {
        if (!pet) return;
        const interval = setInterval(() => {
            const birthDate = new Date(pet.birthDate);
            const now = new Date();
            const ageMs = now.getTime() - birthDate.getTime();
            const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
            setAge(`${ageDays} days old`);

            const lastFed = new Date(pet.lastFed);
            const hoursSinceFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
            const newHunger = Math.max(0, 100 - (hoursSinceFed / (24 * 3)) * 100);
            setHunger(Math.round(newHunger));
        }, 1000);
        return () => clearInterval(interval);
    }, [pet]);

    if (!pet) return null;

    const hungerColor = hunger > 60 ? 'bg-green-500' : hunger > 30 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="p-4 bg-gray-800 border-t border-b border-gray-700 space-y-2">
            <div>
                <span className="font-semibold">Age:</span> {age}
            </div>
             {pet.status !== 'ETERNAL' && (
                <div>
                    <span className="font-semibold">Fullness:</span>
                    <div className="w-full bg-gray-600 rounded-full h-4 mt-1">
                        <div className={`${hungerColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${hunger}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};


const ActionButtons: React.FC<{ onCameraClick: () => void }> = ({ onCameraClick }) => {
    const { feedPet, sendMessage, pet } = useContext(GameContext)!;

    const simpleActions = [
        { name: "Play Ball", emoji: "⚽", message: "Let's play with the ball!" },
        { name: "Go For a Run", emoji: "🏃", message: "Wanna go for a run?" },
        { name: "Take a Nap", emoji: "😴", message: "I'm feeling a bit sleepy, let's nap." },
    ]

    return (
        <div className="p-4 grid grid-cols-2 gap-4">
            <button onClick={feedPet} disabled={pet?.status === 'ETERNAL'} className="flex flex-col items-center justify-center p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:opacity-50">
                <span className="text-3xl">🍲</span>
                <span className="font-semibold">Feed</span>
            </button>
            <button onClick={onCameraClick} className="flex flex-col items-center justify-center p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <span className="text-3xl">📷</span>
                <span className="font-semibold">Camera</span>
            </button>
            {simpleActions.map(action => (
                 <button key={action.name} onClick={() => sendMessage(action.message)} className="flex flex-col items-center justify-center p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <span className="text-3xl">{action.emoji}</span>
                    <span className="font-semibold">{action.name}</span>
                </button>
            ))}
        </div>
    )
}

const GameScreen: React.FC = () => {
  const context = useContext(GameContext);
  const [showCamera, setShowCamera] = useState(false);

  if (!context || !context.pet) {
    return <div>Loading pet...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 text-white overflow-hidden">
      {/* Left Panel - Pet Info and Actions */}
      <div className="w-full md:w-1/3 flex flex-col border-r-0 md:border-r border-gray-700">
        <PetDisplay />
        <StatusBar />
        <ActionButtons onCameraClick={() => setShowCamera(true)} />
      </div>

      {/* Right Panel - Chat */}
      <div className="w-full md:w-2/3 flex-1 flex flex-col">
        <ChatInterface />
      </div>

      {showCamera && <CameraView onClose={() => setShowCamera(false)} />}
    </div>
  );
};

export default GameScreen;
