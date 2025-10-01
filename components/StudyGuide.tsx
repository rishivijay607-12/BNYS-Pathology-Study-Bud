
import React from 'react';

interface StudyGuideProps {
  content: string;
}

// A simple parser to convert markdown-like text to JSX
const formatContent = (text: string) => {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={index} className="text-2xl font-bold mt-6 mb-3 font-display text-slate-700">{line.substring(2, line.length - 2)}</h3>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="mb-2 ml-4">{line.substring(2)}</li>;
    }
    if (line.trim() === '') {
        return <br key={index} />;
    }
    return <p key={index} className="mb-4 text-slate-600 leading-relaxed">{line}</p>;
  });
};


export const StudyGuide: React.FC<StudyGuideProps> = ({ content }) => {
  return (
    <article className="prose max-w-none prose-slate">
      {formatContent(content)}
    </article>
  );
};
