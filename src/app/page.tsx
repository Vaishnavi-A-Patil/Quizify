'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import type { Session } from '@/lib/types';
import { generateQuizAction, refineQuizAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { UploadView } from '@/components/quiz-distiller/upload-view';
import { QuizView } from '@/components/quiz-distiller/quiz-view';
import { ChatView } from '@/components/quiz-distiller/chat-view';
import { AppHeader } from '@/components/quiz-distiller/header';
import { SidebarContent } from '@/components/quiz-distiller/sidebar-content';

export default function Home() {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    null
  );
  const [isGenerating, startGeneration] = React.useTransition();
  const [isRefining, startRefining] = React.useTransition();
  const { toast } = useToast();

  const activeSession = React.useMemo(() => {
    return sessions.find((session) => session.id === activeSessionId) ?? null;
  }, [sessions, activeSessionId]);

  const handleGenerateQuiz = (
    inputType: 'file' | 'url',
    data: string,
    fileName?: string
  ) => {
    startGeneration(async () => {
      try {
        const newSessionData = await generateQuizAction(
          inputType,
          data,
          fileName
        );
        const newSession: Session = {
          ...newSessionData,
          id: `session-${Date.now()}`,
          createdAt: new Date(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred.',
        });
      }
    });
  };

  const handleRefineQuiz = (message: string) => {
    if (!activeSession) return;

    startRefining(async (). -> {
      setSessions(sessions => sessions.map(s => s.id === activeSessionId ? {
        ...s,
        chatHistory: [...s.chatHistory, { role: 'user', content: message }]
      } : s));

      try {
        const { refinedQuiz } = await refineQuizAction(
          activeSession.quiz,
          message
        );
        
        const assistantMessage = "Here is the refined quiz based on your request.";

        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === activeSessionId
              ? {
                  ...session,
                  quiz: refinedQuiz,
                  chatHistory: [
                    ...session.chatHistory,
                    { role: 'model', content: assistantMessage },
                  ],
                  // Reset quiz state when it's refined
                  selectedAnswers: Array(refinedQuiz.length).fill(null),
                  isSubmitted: false,
                }
              : session
          )
        );
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Refining Quiz',
          description:
            error instanceof Error ? error.message : 'Could not update the quiz.',
        });
      }
    });
  };

  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => 
      prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s))
    );
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={() => setActiveSessionId(null)}
        />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6">
          {!activeSession ? (
            <UploadView onGenerate={handleGenerateQuiz} loading={isGenerating} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
              <QuizView
                key={activeSession.id}
                session={activeSession}
                isRefining={isRefining}
                onUpdateSession={updateSession}
              />
              <ChatView
                session={activeSession}
                onSendMessage={handleRefineQuiz}
                isRefining={isRefining}
              />
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
