// Type definitions for the app

// Hanzi Writer Global Definition (Loaded via CDN)
export interface HanziWriterOptions {
  width?: number;
  height?: number;
  padding?: number;
  showOutline?: boolean;
  strokeAnimationSpeed?: number;
  delayBetweenStrokes?: number;
  strokeColor?: string;
  radicalColor?: string;
  showCharacter?: boolean;
  showHintAfterMisses?: number;
  highlightOnComplete?: boolean;
  gridBackground?: boolean;
}

export interface HanziWriter {
  animateCharacter: (options?: { onComplete?: () => void }) => void;
  quiz: (options?: { onComplete?: (summary: any) => void }) => void;
  showCharacter: () => void;
  hideCharacter: () => void;
  cancelQuiz: () => void;
  setCharacter: (char: string) => void;
}

declare global {
  interface Window {
    HanziWriter: {
      create: (element: HTMLElement | string, character: string, options?: HanziWriterOptions) => HanziWriter;
    };
  }
}

// App Data Models
export interface CharacterMetadata {
  character: string;
  pinyin: string;
  definition: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
