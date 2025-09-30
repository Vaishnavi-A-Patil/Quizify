'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining a quiz via a chat interface.
 *
 * It allows users to interact with an LLM to modify quiz questions or answers based on their needs.
 * The file exports:
 * - `refineQuiz`: A function that takes the quiz and the user's message, and returns the refined quiz.
 * - `RefineQuizInput`: The input type for the refineQuiz function.
 * - `RefineQuizOutput`: The output type for the refineQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineQuizInputSchema = z.object({
  quiz: z.string().describe('The quiz to be refined, in JSON format.'),
  message: z.string().describe('The user message to refine the quiz.'),
});
export type RefineQuizInput = z.infer<typeof RefineQuizInputSchema>;

const RefineQuizOutputSchema = z.string().describe('The refined quiz, in JSON format.');
export type RefineQuizOutput = z.infer<typeof RefineQuizOutputSchema>;

export async function refineQuiz(input: RefineQuizInput): Promise<RefineQuizOutput> {
  return refineQuizFlow(input);
}

const refineQuizPrompt = ai.definePrompt({
  name: 'refineQuizPrompt',
  input: {schema: RefineQuizInputSchema},
  output: {schema: RefineQuizOutputSchema},
  prompt: `You are a quiz refinement expert. A user will provide you a quiz and a message to refine it.

Quiz: {{{quiz}}}

Message: {{{message}}}

Based on the message, refine the quiz.  The quiz should be returned in JSON format.  Do not include any explanation text.  Only return the JSON.  Do not deviate from this format. If you do not follow these instructions exactly, the application will break.
`,
});

const refineQuizFlow = ai.defineFlow(
  {
    name: 'refineQuizFlow',
    inputSchema: RefineQuizInputSchema,
    outputSchema: RefineQuizOutputSchema,
  },
  async input => {
    const {output} = await refineQuizPrompt(input);
    return output!;
  }
);
