
import React, { useState } from 'react';
import { Flashcard } from '../types.ts';

interface FlashcardsProps {
  cards: Flashcard[];
}

const FlashcardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-64 perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white border-2 border-teal-300 rounded-xl shadow-md">
          <p className="text-xl font-semibold text-slate-700 text-center">{card.term}</p>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-teal-50 border-2 border-teal-300 rounded-xl shadow-md">
          <p className="text-slate-600 text-center">{card.definition}</p>
        </div>
      </div>
    </div>
  );
};

export const Flashcards: React.FC<FlashcardsProps> = ({ cards }) => {
  return (
    <div>
        <p className="text-sm text-slate-500 mb-6 italic">Click on a card to flip it and reveal the definition.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <FlashcardItem key={index} card={card} />
            ))}
        </div>
    </div>
  );
};

// Add custom utilities for 3D transforms
const style = document.createElement('style');
style.textContent = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;
document.head.append(style);