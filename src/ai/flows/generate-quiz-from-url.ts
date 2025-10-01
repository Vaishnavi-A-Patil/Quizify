'use server';

/**
 * @fileOverview Generates a multiple-choice quiz from a website URL.
 *
 * - generateQuizFromUrl - A function that orchestrates the quiz generation process.
 * - GenerateQuizFromUrlInput - The input type for the generateQuizFromUrl function.
 * - GenerateQuizFromUrlOutput - The return type for the generateQuizFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import * as cheerio from 'cheerio';

const GenerateQuizFromUrlInputSchema = z.object({
  url: z.string().describe('The URL of the website.'),
});
export type GenerateQuizFromUrlInput = z.infer<typeof GenerateQuizFromUrlInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The multiple-choice options.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizFromUrlOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).describe('The generated quiz questions with options and answers.'),
  title: z.string().describe('The title of the website.')
});
export type GenerateQuizFromUrlOutput = z.infer<typeof GenerateQuizFromUrlOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateQuizFromUrlPrompt',
  input: {schema: z.object({textContent: z.string()})},
  output: {schema: z.object({quizQuestions: z.array(QuizQuestionSchema)})},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an expert quiz generator. You will generate a multiple-choice quiz based on the website content provided. The quiz should have approximately 10 questions, each with 4 answer options. One of the options must be the correct answer.

Content: {{{textContent}}}

Quiz Questions:`,
});

const generateQuizFromUrlFlow = ai.defineFlow(
  {
    name: 'generateQuizFromUrlFlow',
    inputSchema: GenerateQuizFromUrlInputSchema,
    outputSchema: GenerateQuizFromUrlOutputSchema,
  },
  async (input) => {
    const response = await fetch(input.url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style').remove();

    const title = $('title').text() || $('h1').first().text() || 'Website Quiz';
    const textContent = $('body').text().replace(/\s\s+/g, ' ').trim();

    if (!textContent) {
      throw new Error('Could not extract any text content from the URL.');
    }
    
    const {output} = await prompt({textContent});

    if (!output) {
      throw new Error('Failed to generate quiz from URL content.');
    }

    return {
      quizQuestions: output.quizQuestions,
      title: title
    };
  }
);

export async function generateQuizFromUrl(input: GenerateQuizFromUrlInput): Promise<GenerateQuizFromUrlOutput> {
  return generateQuizFromUrlFlow(input);
}
