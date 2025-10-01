'use client';

import * as React from 'react';
import type { Session } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizCard } from './quiz-card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Check, RotateCcw } from 'lucide-react';

type QuizViewProps = {
  session: Session;
  isRefining: boolean;
  onUpdateSession: (sessionId: string, updates: Partial<Pick<Session, 'selectedAnswers' | 'isSubmitted'>>) => void;
};

const QuizSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-9 w-full mt-2" />
                </CardContent>
            </Card>
        ))}
    </div>
)

export function QuizView({ session, isRefining, onUpdateSession }: QuizViewProps) {
  const { selectedAnswers, isSubmitted } = session;

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    onUpdateSession(session.id, { selectedAnswers: newAnswers });
  };

  const handleSubmit = () => {
    onUpdateSession(session.id, { isSubmitted: true });
  }

  const handleReset = () => {
    onUpdateSession(session.id, { 
      isSubmitted: false,
      selectedAnswers: Array(session.quiz.length).fill(null) 
    });
  }

  const score = React.useMemo(() => {
    if (!isSubmitted) return 0;
    return selectedAnswers.reduce((totalScore, selectedAnswer, index) => {
      if (selectedAnswer === session.quiz[index].answer) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  }, [selectedAnswers, session.quiz, isSubmitted]);

  const answeredCount = React.useMemo(() => {
    return selectedAnswers.filter(r => r !== null).length
  }, [selectedAnswers]);
  
  const scorePercentage = isSubmitted ? (score / session.quiz.length) * 100 : (answeredCount / session.quiz.length) * 100;

  return (
    <Card className="flex flex-col h-full bg-card">
      <CardHeader>
        <CardTitle>{session.fileName}</CardTitle>
        <CardDescription>
          A quiz generated from your document.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div
          className={cn(
            'absolute inset-0 z-10 bg-background/50 backdrop-blur-sm transition-opacity',
            isRefining ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        />
        <Card className="mb-4">
            <CardHeader className="p-4">
                <CardTitle className="text-lg">{isSubmitted ? 'Final Score' : 'Progress'}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{isSubmitted ? `You scored ${score} out of ${session.quiz.length}`: `Answered: ${answeredCount}/${session.quiz.length}`}</p>
                    {isSubmitted && <p className="text-lg font-bold">{score} <span className='text-sm font-normal text-muted-foreground'>/ {session.quiz.length}</span></p>}
                </div>
                <Progress value={scorePercentage} />
                 {isSubmitted && <p className='text-xs text-muted-foreground mt-2 text-right'>{Math.round(scorePercentage)}% Correct</p>}
            </CardContent>
        </Card>
        <ScrollArea className="h-full pr-6 flex-1">
          <div className="space-y-4">
            {session.quiz.map((q, index) => (
              <QuizCard 
                key={`${session.id}-${index}`} 
                question={q} 
                questionNumber={index + 1}
                selectedOption={selectedAnswers[index]}
                onSelectOption={(option) => handleSelectAnswer(index, option)}
                isSubmitted={isSubmitted}
                />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
       <CardFooter className="pt-6 justify-end gap-2">
            {isSubmitted ? (
                <Button onClick={handleReset}>
                    <RotateCcw className="mr-2" />
                    Retake Quiz
                </Button>
            ) : (
                <Button onClick={handleSubmit}>
                    <Check className="mr-2" />
                    Submit Quiz
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}
