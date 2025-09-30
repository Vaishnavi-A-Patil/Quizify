'use server';

import { generateQuizFromPdf } from '@/ai/flows/generate-quiz-from-pdf';
import { refineQuiz } from '@/ai/flows/refine-quiz-via-chat';
import type { QuizQuestion, Session } from '@/lib/types';
import { z } from 'zod';

// Dummy text to simulate PDF extraction
const DUMMY_PDF_TEXT = `
Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist who is widely held to be one of the greatest and most influential scientists of all time. Best known for developing the theory of relativity, Einstein also made important contributions to the development of the theory of quantum mechanics. His mass–energy equivalence formula E = mc², which arises from relativity theory, has been dubbed "the world's most famous equation".

He received the 1921 Nobel Prize in Physics "for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect", a pivotal step in the development of quantum theory. His work is also known for its influence on the philosophy of science. In a 1999 poll of 130 leading physicists worldwide by the British journal Physics World, Einstein was ranked the greatest physicist of all time. His intellectual achievements and originality have made the word "Einstein" synonymous with "genius".
`;

export async function generateQuizAction(
  fileName: string
): Promise<Omit<Session, 'id' | 'createdAt'>> {
  try {
    const quizData = await generateQuizFromPdf({ pdfText: DUMMY_PDF_TEXT });
    
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
