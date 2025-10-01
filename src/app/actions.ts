'use server';

import { generateQuizFromPdf } from '@/ai/flows/generate-quiz-from-pdf';
import { refineQuiz } from '@/ai/flows/refine-quiz-via-chat';
import type { QuizQuestion, Session } from '@/lib/types';
import { z } from 'zod';
import pdf from 'pdf-parse/lib/pdf-parse';
import { generateQuizFromYoutube } from '@/ai/flows/generate-quiz-from-youtube';

async function extractTextFromPdf(fileContentBase64: string): Promise<string> {
  try {
    const pdfBuffer = Buffer.from(fileContentBase64, 'base64');
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF on server:', error);
    throw new Error('Failed to extract text from the PDF file.');
  }
}

export async function generateQuizAction(
  inputType: 'file' | 'url',
  data: string,
  fileName?: string
): Promise<Omit<Session, 'id' | 'createdAt'>> {
  try {
    let quizData;
    let sessionFileName;

    if (inputType === 'file') {
      if (!fileName) throw new Error('File name is required for file uploads.');
      const pdfText = await extractTextFromPdf(data);
      quizData = await generateQuizFromPdf({ pdfText });
      sessionFileName = fileName;
    } else if (inputType === 'url') {
      const youtubeData = await generateQuizFromYoutube({ youtubeUrl: data });
      quizData = { quizQuestions: youtubeData.quizQuestions };
      sessionFileName = youtubeData.videoTitle;
    } else {
      throw new Error('Invalid input type for quiz generation.');
    }
    
    if (!quizData || !quizData.quizQuestions) {
      throw new Error('Failed to generate quiz.');
    }

    return {
      fileName: sessionFileName,
      quiz: quizData.quizQuestions,
      chatHistory: [],
      selectedAnswers: Array(quizData.quizQuestions.length).fill(null),
      isSubmitted: false,
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
