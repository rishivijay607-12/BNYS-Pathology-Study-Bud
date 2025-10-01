import { GoogleGenAI, Type } from "@google/genai";
import { StudyMode, Flashcard, QuizQuestion } from '../types.ts';

const BNYS_CONTEXT_PROMPT = "You are an expert in pathology, creating study materials for a student of Bachelor of Naturopathy and Yogic Sciences (BNYS). The explanations should be clear, concise, and relevant to a holistic and natural medicine perspective where appropriate, while still being medically accurate. ";

async function generateStudyGuide(apiKey: string, topic: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `${BNYS_CONTEXT_PROMPT} Generate a detailed study guide on the topic: "${topic}". Structure the guide with clear headings (using **Heading** format), bullet points (using * Point format), and key takeaways. Focus on etiology, pathogenesis, morphological features, and clinical significance.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text;
}

async function generateFlashcards(apiKey: string, topic: string): Promise<Flashcard[]> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `${BNYS_CONTEXT_PROMPT} Generate 10-15 key flashcards for the pathology topic: "${topic}". For each flashcard, provide a key term and its concise definition.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: {
              type: Type.STRING,
              description: "The key pathological term.",
            },
            definition: {
              type: Type.STRING,
              description: "A concise definition of the term.",
            },
          },
          required: ["term", "definition"],
        },
      },
    },
  });

  try {
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as Flashcard[];
  } catch (error) {
    console.error("Failed to parse flashcards JSON:", error);
    throw new Error("Received invalid format for flashcards.");
  }
}

async function generateQuiz(apiKey: string, topic: string): Promise<QuizQuestion[]> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `${BNYS_CONTEXT_PROMPT} Create a multiple-choice quiz with 5-7 questions on the pathology topic: "${topic}". Each question should have four options, one correct answer, and a brief explanation for the correct answer.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The quiz question.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 4 possible answers.",
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The correct answer from the options.",
            },
            explanation: {
                type: Type.STRING,
                description: "A brief explanation for why the answer is correct."
            }
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  try {
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as QuizQuestion[];
  } catch (error) {
    console.error("Failed to parse quiz JSON:", error);
    throw new Error("Received invalid format for quiz questions.");
  }
}

export async function generateContent(apiKey: string, topic: string, mode: StudyMode): Promise<string | Flashcard[] | QuizQuestion[]> {
  switch (mode) {
    case StudyMode.Guide:
      return generateStudyGuide(apiKey, topic);
    case StudyMode.Flashcards:
      return generateFlashcards(apiKey, topic);
    case StudyMode.Quiz:
      return generateQuiz(apiKey, topic);
    default:
      throw new Error("Invalid study mode selected.");
  }
}