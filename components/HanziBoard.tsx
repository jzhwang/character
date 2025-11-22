import React, { useEffect, useRef, useState } from 'react';
import { HanziWriter } from '../types';

interface HanziBoardProps {
  character: string;
  mode: 'demo' | 'quiz';
  onModeChange: (mode: 'demo' | 'quiz') => void;
}

const HanziBoard: React.FC<HanziBoardProps> = ({ character, mode, onModeChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [statusText, setStatusText] = useState<string>("准备好了吗？选择一个模式开始吧！");

  useEffect(() => {
    if (!containerRef.current || !window.HanziWriter) return;

    // Clean up previous instance if character changes
    containerRef.current.innerHTML = '';

    try {
      const writer = window.HanziWriter.create(containerRef.current, character, {
        width: 300,
        height: 300,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor: '#166534', // green-800
        radicalColor: '#16a34a', // green-600
        highlightOnComplete: true,
        showCharacter: true, // Start visible
      });

      writerRef.current = writer;
      
      // Reset status when character changes
      setStatusText("准备好了吗？选择一个模式开始吧！");
      
      // If mode is already quiz when char changes (unlikely flow but good for robustness), start quiz
      if (mode === 'quiz') {
        startQuiz(writer);
      } else {
        // Just animate once for effect on load if desired, or just stay static
        writer.showCharacter(); 
      }

    } catch (e) {
      console.error("Failed to initialize HanziWriter", e);
      setStatusText("哎呀，无法加载这个字的笔画数据。");
    }

    return () => {
      // Cleanup not strictly necessary for DOM as we clear innerHTML, 
      // but good practice if library had destroy method.
      if (writerRef.current) {
         writerRef.current.cancelQuiz();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // React to mode changes or manual triggers
  useEffect(() => {
    if (!writerRef.current) return;

    if (mode === 'demo') {
      writerRef.current.cancelQuiz();
      writerRef.current.showCharacter();
      setStatusText("仔细看哦，笔画是这样写的~");
      writerRef.current.animateCharacter({
        onComplete: () => {
             setStatusText("看清楚了吗？试试自己写写看！");
        }
      });
    } else if (mode === 'quiz') {
      startQuiz(writerRef.current);
    }
  }, [mode, character]); // Depend on character to restart logic if needed

  const startQuiz = (writer: HanziWriter) => {
    setStatusText("轮到你了！请在方格里跟着写。");
    writer.quiz({
      onComplete: (summary) => {
        setStatusText(`太棒了！写得${summary.totalMistakes === 0 ? '完美' : '不错'}哦！`);
        onModeChange('demo'); // Reset to demo mode visuals after success
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative p-4 bg-white rounded-xl shadow-lg border border-gray-100">
         {/* Badge */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          {mode === 'demo' ? '演示模式' : '描红模式'}
        </div>

        {/* Board Area */}
        <div 
          ref={containerRef} 
          className="hanzi-grid-bg w-[300px] h-[300px] rounded-lg cursor-crosshair bg-white"
          style={{ touchAction: 'none' }} // Prevent scrolling on mobile while writing
        />
      </div>

      <p className="text-gray-600 font-medium text-sm min-h-[20px] text-center">
        {statusText}
      </p>

      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => onModeChange('demo')}
          className={`flex items-center px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
            mode === 'demo' 
              ? 'bg-blue-500 text-white ring-2 ring-blue-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          演示笔画
        </button>
        
        <button
          onClick={() => onModeChange('quiz')}
          className={`flex items-center px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
            mode === 'quiz' 
              ? 'bg-gray-800 text-white ring-2 ring-gray-400' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          开始描红
        </button>
      </div>
    </div>
  );
};

export default HanziBoard;