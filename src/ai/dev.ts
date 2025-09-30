import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-pdf.ts';
import '@/ai/flows/refine-quiz-via-chat.ts';