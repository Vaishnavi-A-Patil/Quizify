export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Session {
  id: string;
  fileName: string;
  quiz: QuizQuestion[];
  chatHistory: ChatMessage[];
  createdAt: Date;
}
