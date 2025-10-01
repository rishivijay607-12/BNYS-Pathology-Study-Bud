import React, { useState } from 'react';
import { PATHOLOGY_TOPICS } from '../constants.ts';
import { StudyMode } from '../types.ts';
import { BookOpenIcon, SparklesIcon, QuestionMarkIcon } from './icons/index.tsx';

interface SidebarProps {
  onGenerate: (topic: string, mode: StudyMode) => void;
  isLoading: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isLoading, apiKey, setApiKey }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<StudyMode | null>(null);
  const [showApiSaveConfirm, setShowApiSaveConfirm] = useState(false);

  const handleSaveApiKey = () => {
    if (!apiKey) return;
    localStorage.setItem('gemini_api_key', apiKey);
    setShowApiSaveConfirm(true);
    setTimeout(() => setShowApiSaveConfirm(false), 2500);
  };

  const handleGenerateClick = () => {
    if (selectedTopic && selectedMode && apiKey) {
      onGenerate(selectedTopic, selectedMode);
    }
  };

  return (
    <aside className="w-1/3 max-w-sm bg-white p-6 shadow-lg flex flex-col h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 font-display">BNYS Study Buddy</h1>
        <p className="text-slate-500 mt-1">Your AI Pathology Assistant</p>
      </header>
      
      <div className="flex-grow">
        <section className="mb-6">
          <label htmlFor="topic-select" className="block text-sm font-bold text-slate-700 mb-2">1. Choose a Topic</label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            disabled={isLoading}
          >
            <option value="" disabled>Select a pathology topic</option>
            {PATHOLOGY_TOPICS.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </section>

        <section className="mb-8">
          <h3 className="block text-sm font-bold text-slate-700 mb-2">2. Select a Study Mode</h3>
          <div className="space-y-2">
            <ModeButton
              label="Study Guide"
              icon={<BookOpenIcon />}
              isSelected={selectedMode === StudyMode.Guide}
              onClick={() => setSelectedMode(StudyMode.Guide)}
              disabled={isLoading}
            />
            <ModeButton
              label="Flashcards"
              icon={<SparklesIcon />}
              isSelected={selectedMode === StudyMode.Flashcards}
              onClick={() => setSelectedMode(StudyMode.Flashcards)}
              disabled={isLoading}
            />
            <ModeButton
              label="Quiz Me"
              icon={<QuestionMarkIcon />}
              isSelected={selectedMode === StudyMode.Quiz}
              onClick={() => setSelectedMode(StudyMode.Quiz)}
              disabled={isLoading}
            />
          </div>
        </section>
        
        <section className="mb-6">
            <label htmlFor="api-key-input" className="block text-sm font-bold text-slate-700 mb-2">3. Your Gemini API Key</label>
            <div className="flex items-center space-x-2">
                <input
                    id="api-key-input"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                    className="flex-grow p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSaveApiKey}
                    disabled={!apiKey || isLoading}
                    className="bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Save API Key"
                >
                    Save
                </button>
            </div>
             {showApiSaveConfirm && (
                <p className="text-sm text-green-600 mt-2 fade-in">✓ API Key saved successfully!</p>
            )}
            {!apiKey && (
                 <p className="text-xs text-slate-500 mt-2">Your key is stored only in your browser's local storage.</p>
            )}
        </section>
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={!selectedTopic || !selectedMode || isLoading || !apiKey}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-transform transform active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Content'
        )}
      </button>
    </aside>
  );
};

interface ModeButtonProps {
    label: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
}

const ModeButton: React.FC<ModeButtonProps> = ({ label, icon, isSelected, onClick, disabled }) => {
    const baseClasses = "w-full text-left p-3 flex items-center space-x-3 rounded-lg border transition-colors";
    const selectedClasses = "bg-teal-50 border-teal-500 text-teal-800 font-semibold";
    const unselectedClasses = "bg-white border-slate-200 hover:bg-slate-50 text-slate-600";
    const disabledClasses = "bg-slate-100 cursor-not-allowed opacity-60";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${disabled ? disabledClasses : ''}`}
        >
            <span className={isSelected ? 'text-teal-600' : 'text-slate-400'}>{icon}</span>
            <span>{label}</span>
        </button>
    )
}