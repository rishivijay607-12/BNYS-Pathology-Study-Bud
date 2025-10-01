
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { ContentDisplay } from './components/ContentDisplay.tsx';
import { generateContent } from './services/geminiService.ts';
import { StudyMode, Flashcard, QuizQuestion } from './types.ts';

const App: React.FC = () => {
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string | Flashcard[] | QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'content'>('welcome');

  const handleGenerate = useCallback(async (selectedTopic: string, selectedMode: StudyMode, apiKey: string) => {
    if (!selectedTopic || !selectedMode) {
      setError("Please select a topic and a study mode.");
      return;
    }
    if (!apiKey) {
        setError("Please enter your Gemini API Key.");
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setContent(null);
    setCurrentView('content');
    setTopic(selectedTopic);
    setStudyMode(selectedMode);

    try {
      const result = await generateContent(selectedTopic, selectedMode, apiKey);
      setContent(result);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while generating content. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar onGenerate={handleGenerate} isLoading={isLoading} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <ContentDisplay
          view={currentView}
          studyMode={studyMode}
          topic={topic}
          content={content}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;