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
    if (!apiKey) {
      setCurrentView('content');
      setError("Please enter and save your Gemini API Key in the sidebar.");
      return;
    }
    if (!selectedTopic || !selectedMode) {
      setError("Please select a topic and a study mode.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setContent(null);
    setCurrentView('content');
    setTopic(selectedTopic);
    setStudyMode(selectedMode);

    try {
      const result = await generateContent(apiKey, selectedTopic, selectedMode);
      setContent(result);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        if (e.message.includes('API key not valid')) {
          setError("Your API key is not valid. Please check it and save it again.");
        } else {
          setError(e.message);
        }
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