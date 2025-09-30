'use server';

import { generateQuizFromPdf } from '@/ai/flows/generate-quiz-from-pdf';
import { refineQuiz } from '@/ai/flows/refine-quiz-via-chat';
import type { QuizQuestion, Session } from '@/lib/types';
import { z } from 'zod';

export async function generateQuizAction(
  fileName: string,
  fileContent: string
): Promise<Omit<Session, 'id' | 'createdAt'>> {
  try {
    const quizData = await generateQuizFromPdf({ pdfText: fileContent });
    
    if (!quizData || !quizData.quizQuestions) {
      throw new Error('Failed to generate quiz.');
    }

    return {
      fileName,
      quiz: quizData.quizQuestions,
      chatHistory: [],
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Could not generate quiz from the provided document.');
  }
}

const RefinedQuizSchema = z.array(z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
}));


export async function refineQuizAction(
  currentQuiz: QuizQuestion[],
  userMessage: string
): Promise<{ refinedQuiz: QuizQuestion[] }> {
  try {
    const quizJsonString = JSON.stringify(currentQuiz);
    
    const refinedQuizString = await refineQuiz({
      quiz: quizJsonString,
      message: userMessage,
    });

    const cleanedJson = refinedQuizString.replace(/```json\n|```/g, '').trim();

    const validation = RefinedQuizSchema.safeParse(JSON.parse(cleanedJson));
    if (!validation.success) {
      console.error("Failed to parse refined quiz:", validation.error);
      return { refinedQuiz: currentQuiz };
    }
    
    return { refinedQuiz: validation.data };

  } catch (error) {
    console.error('Error refining quiz:', error);
    throw new Error('Could not refine the quiz. Please try again.');
  }
}
