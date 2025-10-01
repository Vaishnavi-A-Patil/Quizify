import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-pdf.ts';
import '@/ai/flows/refine-quiz-via-chat.ts';
import '@/ai/flows/generate-quiz-from-youtube.ts';
import '@/ai/flows/generate-quiz-from-text.ts';
