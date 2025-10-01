'use server';

/**
 * @fileOverview Generates a multiple-choice quiz from a YouTube video's transcript.
 *
 * - generateQuizFromYoutube - A function that orchestrates the quiz generation process.
 * - GenerateQuizFromYoutubeInput - The input type for the generateQuizFromYoutube function.
 * - GenerateQuizFromYoutubeOutput - The return type for the generateQuizFromYoutube function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import { YoutubeTranscript } from 'youtube-transcript';

const GenerateQuizFromYoutubeInputSchema = z.object({
  youtubeUrl: z
    .string()
    .describe('The URL of the YouTube video.'),
});
export type GenerateQuizFromYoutubeInput = z.infer<typeof GenerateQuizFromYoutubeInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The multiple-choice options.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizFromYoutubeOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).describe('The generated quiz questions with options and answers.'),
  videoTitle: z.string().describe('The title of the YouTube video.')
});
export type GenerateQuizFromYoutubeOutput = z.infer<typeof GenerateQuizFromYoutubeOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateQuizFromYoutubePrompt',
  input: {schema: z.object({transcript: z.string()})},
  output: {schema: z.object({quizQuestions: z.array(QuizQuestionSchema)})},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an expert quiz generator. You will generate a multiple-choice quiz based on the video transcript provided. The quiz should have approximately 10 questions, each with 4 answer options. One of the options must be the correct answer.

Transcript: {{{transcript}}}

Quiz Questions:`,
});

const generateQuizFromYoutubeFlow = ai.defineFlow(
  {
    name: 'generateQuizFromYoutubeFlow',
    inputSchema: GenerateQuizFromYoutubeInputSchema,
    outputSchema: GenerateQuizFromYoutubeOutputSchema,
  },
  async (input) => {
    const transcriptResponse = await YoutubeTranscript.fetchTranscript(input.youtubeUrl);
    
    if (!transcriptResponse || transcriptResponse.length === 0) {
      throw new Error('Could not fetch transcript from the YouTube video.');
    }
    
    const transcript = transcriptResponse.map(t => t.text).join(' ');
    
    const {output} = await prompt({transcript});

    if (!output) {
      throw new Error('Failed to generate quiz from YouTube transcript.');
    }

    return {
      quizQuestions: output.quizQuestions,
      videoTitle: 'YouTube Video Quiz' // Using a placeholder title
    };
  }
);


export async function generateQuizFromYoutube(input: GenerateQuizFromYoutubeInput): Promise<GenerateQuizFromYoutubeOutput> {
  return generateQuizFromYoutubeFlow(input);
}
