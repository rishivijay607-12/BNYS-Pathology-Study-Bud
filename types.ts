
export enum StudyMode {
  Guide = 'guide',
  Flashcards = 'flashcards',
  Quiz = 'quiz',
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}
