
import React, { useState } from 'react';
import { QuizQuestion } from '../types.ts';

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };
  
  const handleRetake = () => {
    setShowResults(false);
    setUserAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
  }

  const score = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;

  if (showResults) {
    return (
      <div>
        <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
        <p className="text-lg mb-6">You scored <span className="font-bold text-teal-600">{score}</span> out of <span className="font-bold">{questions.length}</span></p>
        
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className={`p-4 rounded-lg border ${userAnswers[index] === q.correctAnswer ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
              <p>Your answer: <span className="font-medium">{userAnswers[index] || 'Not answered'}</span></p>
              <p>Correct answer: <span className="font-medium">{q.correctAnswer}</span></p>
              <p className="text-sm mt-2 text-slate-600"><em>Explanation:</em> {q.explanation}</p>
            </div>
          ))}
        </div>
        <button
            onClick={handleRetake}
            className="mt-8 bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition"
        >
            Retake Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="text-xl font-semibold my-2">{currentQuestion.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
              selectedAnswer === option
                ? 'bg-teal-100 border-teal-500'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};