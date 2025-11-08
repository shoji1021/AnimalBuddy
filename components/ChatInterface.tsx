
import React, { useState, useContext, useEffect, useRef } from 'react';
import { GameContext } from '../context/GameContext';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const context = useContext(GameContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [context?.chatHistory]);

  const handleSend = () => {
    if (input.trim() && context && !context.isLoading) {
      context.sendMessage(input.trim());
      setInput('');
    }
  };

  if (!context) return null;
  const { chatHistory, isLoading, pet } = context;

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.role === 'user';
    const groundingChunks = msg.groundingMetadata?.groundingChunks?.filter((c: any) => c.web?.uri);

    return (
      <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-2 my-2`}>
          <div className={`px-4 py-2 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg ${isUser ? 'bg-indigo-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
            <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
          </div>
        </div>
        {!isUser && groundingChunks && groundingChunks.length > 0 && (
          <div className="mb-2 px-2 max-w-sm md:max-w-md lg:max-w-lg text-xs text-gray-400">
            <strong>Sources:</strong>
            <ol className="list-decimal list-inside space-y-1 mt-1">
              {groundingChunks.map((chunk: any, i: number) => (
                <li key={i}>
                  <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline" title={chunk.web.uri}>
                    {chunk.web.title || chunk.web.uri}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-800 md:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            Say hello to your new partner, {pet?.name}!
          </div>
        )}
        {chatHistory.map(renderMessage)}
        {isLoading && (
            <div className="flex items-end gap-2 my-2 justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-700 rounded-bl-none">
                <div className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full p-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Talk to your partner..."
            className="flex-1 bg-transparent text-white px-4 py-2 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
