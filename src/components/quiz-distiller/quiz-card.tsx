'use client';

import * as React from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Check, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type QuizCardProps = {
  question: QuizQuestion;
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onRevealChange: (isRevealed: boolean) => void;
};

export function QuizCard({ question, questionNumber, selectedOption, onSelectOption, onRevealChange }: QuizCardProps) {
  const [isAnswerRevealed, setIsAnswerRevealed] = React.useState(false);

  const handleOptionChange = (value: string) => {
    if (!isAnswerRevealed) {
      onSelectOption(value);
    }
  };
  
  const handleRevealToggle = (open: boolean) => {
    setIsAnswerRevealed(open);
    onRevealChange(open);
  };

  const getOptionClass = (option: string) => {
    if (!isAnswerRevealed) return '';
    if (option === question.answer) return 'text-green-600 dark:text-green-500';
    if (option === selectedOption && option !== question.answer) return 'text-red-600 dark:text-red-500';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {questionNumber}. {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedOption ?? undefined} onValueChange={handleOptionChange} disabled={isAnswerRevealed}>
            <div className="space-y-2">
            {question.options.map((option, index) => (
                <div key={index} className={cn("flex items-center space-x-3", getOptionClass(option))}>
                    <RadioGroupItem value={option} id={`q${questionNumber}-o${index}`} />
                    <Label htmlFor={`q${questionNumber}-o${index}`}>{option}</Label>
                    {isAnswerRevealed && option === question.answer && <Check className="h-5 w-5 text-green-600" />}
                    {isAnswerRevealed && selectedOption === option && option !== question.answer && <X className="h-5 w-5 text-red-600" />}
                </div>
            ))}
            </div>
        </RadioGroup>

        <Collapsible onOpenChange={handleRevealToggle}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {isAnswerRevealed ? 'Hide' : 'Reveal'} Answer
              <ChevronsUpDown className="h-4 w-4 ml-2" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 p-3 bg-muted rounded-md border">
              <p className="text-sm font-semibold">
                Correct Answer: <span className="font-normal">{question.answer}</span>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
