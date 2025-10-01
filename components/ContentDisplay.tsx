
import React from 'react';
import { StudyMode, Flashcard, QuizQuestion } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { StudyGuide } from './StudyGuide';
import { Flashcards } from './Flashcards';
import { Quiz } from './Quiz';

interface ContentDisplayProps {
  view: 'welcome' | 'content';
  studyMode: StudyMode | null;
  topic: string | null;
  content: string | Flashcard[] | QuizQuestion[] | null;
  isLoading: boolean;
  error: string | null;
}

const WelcomeScreen: React.FC = () => (
    <div className="text-center flex flex-col items-center justify-center h-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <img src="https://picsum.photos/seed/pathology/400/250" alt="Medical study" className="rounded-lg mb-8 shadow-lg" />
        <h2 className="text-4xl font-bold text-slate-700 mb-2 font-display">Welcome to your Study Buddy!</h2>
        <p className="text-slate-500 max-w-md">
            Select a pathology topic and a study mode from the panel on the left to get started. Let's master pathology together!
        </p>
    </div>
);

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  view,
  studyMode,
  topic,
  content,
  isLoading,
  error,
}) => {
  if (view === 'welcome') {
    return <WelcomeScreen />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-2xl p-8">
        <div className="text-center text-red-600">
          <h3 className="text-2xl font-bold mb-2">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const renderContent = () => {
    switch (studyMode) {
      case StudyMode.Guide:
        return <StudyGuide content={content as string} />;
      case StudyMode.Flashcards:
        return <Flashcards cards={content as Flashcard[]} />;
      case StudyMode.Quiz:
        return <Quiz questions={content as QuizQuestion[]} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 h-full overflow-y-auto">
        <h2 className="text-3xl font-bold mb-1 font-display text-slate-800">{topic}</h2>
        <p className="text-teal-600 font-semibold capitalize mb-6 border-b pb-4 border-slate-200">{studyMode} Mode</p>
        {renderContent()}
    </div>
  );
};
