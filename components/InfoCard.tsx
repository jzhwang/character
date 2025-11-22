import React, { useState } from 'react';
import { CharacterMetadata } from '../types';

interface InfoCardProps {
  data: CharacterMetadata | null;
  isLoading: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ data, isLoading }) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const handleSpeak = (text: string, key: string, lang: string = 'zh-CN') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // If clicking the same button that is currently playing, just stop it
      if (playingKey === key) {
        setPlayingKey(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      // Set language based on parameter
      utterance.lang = lang;
      utterance.rate = 0.8; // Slightly slower for clarity
      
      utterance.onstart = () => setPlayingKey(key);
      utterance.onend = () => setPlayingKey(null);
      utterance.onerror = () => setPlayingKey(null);
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API not supported in this browser.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">正在查找这个字的故事...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[300px] flex flex-col justify-center text-center text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>想学哪个字？在左边输入告诉我吧！</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-green-50 px-6 py-3 border-b border-green-100 flex items-center">
        <span className="text-xl mr-2">📖</span>
        <span className="text-green-800 font-bold">汉字小档案</span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Pinyin Row */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <span className="text-gray-500 text-sm">拼音</span>
          <div className="flex items-center gap-3">
            <button 
                onClick={() => handleSpeak(data.character, 'char', 'zh-CN')}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 cursor-pointer ${
                    playingKey === 'char' 
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-400' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                }`}
                title="朗读发音"
                aria-label="朗读发音"
            >
                {playingKey === 'char' ? (
                     <span className="flex space-x-0.5">
                        <span className="w-0.5 h-3 bg-current animate-[bounce_0.8s_infinite]"></span>
                        <span className="w-0.5 h-3 bg-current animate-[bounce_0.8s_infinite_0.2s]"></span>
                        <span className="w-0.5 h-3 bg-current animate-[bounce_0.8s_infinite_0.4s]"></span>
                     </span>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                )}
            </button>
            <span className="text-3xl font-bold text-gray-800 font-sans">{data.pinyin}</span>
          </div>
        </div>

        {/* Definition Row */}
        <div className="space-y-1">
          <span className="text-gray-500 text-sm block">意思 (Meaning)</span>
          <p className="text-gray-800 font-medium leading-relaxed">
            {data.definition}
          </p>
        </div>

        {/* Example Box */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 relative group">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center">
                <span className="text-lg mr-1">🗣️</span>
                <span className="text-amber-800 text-xs font-bold uppercase tracking-wider">生活例句 Daily Life</span>
             </div>
             <button 
                onClick={() => handleSpeak(data.exampleSentence, 'sentence', 'zh-CN')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    playingKey === 'sentence'
                    ? 'text-amber-700 bg-amber-200'
                    : 'text-amber-500 hover:text-amber-700 hover:bg-amber-100'
                }`}
                title="朗读中文例句"
            >
                 {playingKey === 'sentence' ? (
                    <span className="flex items-center justify-center w-5 h-5">
                       <span className="block w-2 h-2 bg-current rounded-full animate-ping"></span>
                    </span>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                )}
            </button>
          </div>
          <p className="text-gray-800 font-medium text-lg italic mb-1">
            "{data.exampleSentence}"
          </p>
          
          {/* English Translation Row */}
          <div className="flex items-start justify-between mt-2 pt-2 border-t border-amber-100/50">
            <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                {data.exampleTranslation}
            </p>
            <button 
                onClick={() => handleSpeak(data.exampleTranslation, 'translation', 'en-US')}
                className={`ml-2 p-1.5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                    playingKey === 'translation'
                    ? 'text-amber-700 bg-amber-200'
                    : 'text-amber-400 hover:text-amber-600 hover:bg-amber-100'
                }`}
                title="Read English Translation"
            >
                 {playingKey === 'translation' ? (
                    <span className="flex items-center justify-center w-4 h-4">
                       <span className="block w-1.5 h-1.5 bg-current rounded-full animate-ping"></span>
                    </span>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;