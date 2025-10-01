'use server';

/**
 * @fileOverview Generates a multiple-choice quiz from a given text.
 *
 * - generateQuizFromText - A function that orchestrates the quiz generation process.
 * - GenerateQuizFromTextInput - The input type for the generateQuizFromText function.
 * - GenerateQuizFromTextOutput - The return type for the generateQuizFromText function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateQuizFromTextInputSchema = z.object({
  text: z.string().describe('The text to generate a quiz from.'),
});
export type GenerateQuizFromTextInput = z.infer<typeof GenerateQuizFromTextInputSchema>;

const GenerateQuizFromTextOutputSchema = z.object({
  quizQuestions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The multiple-choice options.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions with options and answers.'),
});
export type GenerateQuizFromTextOutput = z.infer<typeof GenerateQuizFromTextOutputSchema>;

export async function generateQuizFromText(input: GenerateQuizFromTextInput): Promise<GenerateQuizFromTextOutput> {
  return generateQuizFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTextPrompt',
  input: {schema: GenerateQuizFromTextInputSchema},
  output: {schema: GenerateQuizFromTextOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an expert quiz generator. You will generate a multiple-choice quiz based on the text provided. The quiz should have approximately 10 questions, each with 4 answer options. One of the options must be the correct answer.

Text: {{{text}}}

Quiz Questions:`,
});

const generateQuizFromTextFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTextFlow',
    inputSchema: GenerateQuizFromTextInputSchema,
    outputSchema: GenerateQuizFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
