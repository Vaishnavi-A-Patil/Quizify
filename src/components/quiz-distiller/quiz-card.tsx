'use client';

import * as React from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type QuizCardProps = {
  question: QuizQuestion;
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isSubmitted: boolean;
};

export function QuizCard({ question, questionNumber, selectedOption, onSelectOption, isSubmitted }: QuizCardProps) {

  const handleOptionChange = (value: string) => {
    if (!isSubmitted) {
      onSelectOption(value);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isSubmitted) return '';
    if (option === question.answer) return 'text-green-600 dark:text-green-500';
    if (option === selectedOption && option !== question.answer) return 'text-red-600 dark:text-red-500';
    return '';
  };

  return (
    <Card className="glassmorphism-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {questionNumber}. {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedOption ?? undefined} onValueChange={handleOptionChange} disabled={isSubmitted}>
            <div className="space-y-2">
            {question.options.map((option, index) => (
                <div key={index} className={cn("flex items-center space-x-3", getOptionClass(option))}>
                    <RadioGroupItem value={option} id={`q${questionNumber}-o${index}`} />
                    <Label htmlFor={`q${questionNumber}-o${index}`}>{option}</Label>
                    {isSubmitted && option === question.answer && <Check className="h-5 w-5 text-green-600" />}
                    {isSubmitted && selectedOption === option && option !== question.answer && <X className="h-5 w-5 text-red-600" />}
                </div>
            ))}
            </div>
        </RadioGroup>

        {isSubmitted && selectedOption !== question.answer && (
            <div className="mt-4 p-3 bg-muted rounded-md border">
              <p className="text-sm font-semibold">
                Correct Answer: <span className="font-normal">{question.answer}</span>
              </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
