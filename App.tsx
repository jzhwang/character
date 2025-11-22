import React, { useState, useEffect } from 'react';
import HanziBoard from './components/HanziBoard';
import InfoCard from './components/InfoCard';
import { fetchCharacterMetadata } from './services/geminiService';
import { CharacterMetadata, AppState } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('猫'); // Default character
  const [activeCharacter, setActiveCharacter] = useState<string>('猫');
  const [characterData, setCharacterData] = useState<CharacterMetadata | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [boardMode, setBoardMode] = useState<'demo' | 'quiz'>('demo');

  // Load initial data
  useEffect(() => {
    handleGenerate(activeCharacter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (charToLoad: string) => {
    if (!charToLoad) return;
    
    // Take only the first character if user types multiple
    const cleanChar = charToLoad.trim().charAt(0);
    if (!/[\u4e00-\u9fa5]/.test(cleanChar)) {
        alert("哎呀，请输入一个汉字哦~ (Please enter a valid Chinese character)");
        return;
    }

    setActiveCharacter(cleanChar);
    setBoardMode('demo'); // Reset to demo on new char
    setAppState(AppState.LOADING);

    try {
      const data = await fetchCharacterMetadata(cleanChar);
      setCharacterData(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(input);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fcfc]">
      {/* Header */}
      <header className="pt-10 pb-6 text-center">
        <div className="flex items-center justify-center mb-2">
            <span className="text-4xl mr-3">✍️</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
            Jessica汉字笔画学习器
            </h1>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
            Interactive Stroke Order Practice Board
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pb-12 flex flex-col items-center">
        
        {/* Input Section */}
        <div className="w-full max-w-xl mb-12">
          <form onSubmit={handleSubmit} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center">
             <input 
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="想学哪个字？输入试试..."
               className="flex-grow px-6 py-3 text-xl text-gray-800 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none text-center md:text-left"
               maxLength={1}
             />
             <button 
               type="submit"
               disabled={appState === AppState.LOADING}
               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
             >
               {appState === AppState.LOADING ? (
                 <span className="inline-block animate-spin mr-2">↻</span>
               ) : (
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                 </svg>
               )}
               开始学习
             </button>
          </form>
        </div>

        {/* Interactive Area */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full max-w-5xl">
            
            {/* Left: Hanzi Writer Board */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
                 <HanziBoard 
                    character={activeCharacter} 
                    mode={boardMode} 
                    onModeChange={setBoardMode} 
                 />
            </div>

            {/* Right: Info Card */}
            <div className="flex-1 w-full flex justify-center lg:justify-start">
                <InfoCard 
                    data={characterData} 
                    isLoading={appState === AppState.LOADING} 
                />
            </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2025 由 Jessica 制作</p>
      </footer>
    </div>
  );
};

export default App;