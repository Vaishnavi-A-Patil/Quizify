'use client';

import * as React from 'react';
import type { Session } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizCard } from './quiz-card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

type QuizViewProps = {
  session: Session;
  isRefining: boolean;
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

export function QuizView({ session, isRefining }: QuizViewProps) {
  const [selectedAnswers, setSelectedAnswers] = React.useState<(string | null)[]>(
    () => Array(session.quiz.length).fill(null)
  );

  const [revealedAnswers, setRevealedAnswers] = React.useState<boolean[]>(
    () => Array(session.quiz.length).fill(false)
  );

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };

  const handleRevealAnswer = (questionIndex: number, isRevealed: boolean) => {
    setRevealedAnswers(prev => {
        const newRevealed = [...prev];
        newRevealed[questionIndex] = isRevealed;
        return newRevealed;
    })
  }

  const score = React.useMemo(() => {
    return selectedAnswers.reduce((totalScore, selectedAnswer, index) => {
      if (revealedAnswers[index] && selectedAnswer === session.quiz[index].answer) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  }, [selectedAnswers, session.quiz, revealedAnswers]);

  const answeredCount = React.useMemo(() => {
    return revealedAnswers.filter(r => r).length
  }, [revealedAnswers]);
  
  const scorePercentage = answeredCount > 0 ? (score / answeredCount) * 100 : 0;


  return (
    <Card className="flex flex-col h-full">
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
                <CardTitle className="text-lg">Score</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{`Answered: ${answeredCount}/${session.quiz.length}`}</p>
                    <p className="text-lg font-bold">{score} <span className='text-sm font-normal text-muted-foreground'>/ {answeredCount}</span></p>
                </div>
                <Progress value={scorePercentage} />
                 {answeredCount > 0 && <p className='text-xs text-muted-foreground mt-2 text-right'>{Math.round(scorePercentage)}% Correct</p>}
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
                onRevealChange={(isRevealed) => handleRevealAnswer(index, isRevealed)}
                />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
