'use client';

import type { Session } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizCard } from './quiz-card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

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
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{session.fileName}</CardTitle>
        <CardDescription>
          A quiz generated from your document.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 relative">
        <div
          className={cn(
            'absolute inset-0 z-10 bg-background/50 backdrop-blur-sm transition-opacity',
            isRefining ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        />
        <ScrollArea className="h-full pr-6">
          <div className="space-y-4">
            {session.quiz.map((q, index) => (
              <QuizCard key={`${session.id}-${index}`} question={q} questionNumber={index + 1} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
