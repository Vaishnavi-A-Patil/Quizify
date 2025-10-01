'use client';

import * as React from 'react';
import type { Session } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from '../icons';

type ChatViewProps = {
  session: Session;
  onSendMessage: (message: string) => void;
  isRefining: boolean;
};

export function ChatView({ session, onSendMessage, isRefining }: ChatViewProps) {
  const [message, setMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [session.chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Refine Quiz</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {session.chatHistory.map((chat, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', {
                  'justify-end': chat.role === 'user',
                })}
              >
                {chat.role === 'model' && (
                  <Avatar className="w-8 h-8 border">
                    <div className="p-1.5 bg-primary-foreground text-primary">
                      <Logo />
                    </div>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg max-w-[80%]',
                    chat.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{chat.content}</p>
                </div>
                 {chat.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isRefining && session.chatHistory.at(-1)?.role === 'user' && (
               <div className='flex items-start gap-3'>
                  <Avatar className="w-8 h-8 border">
                    <div className="p-1.5 bg-primary-foreground text-primary">
                      <Logo />
                    </div>
                  </Avatar>
                  <div className='p-3 rounded-lg bg-muted flex items-center'>
                    <Loader2 className="h-4 w-4 animate-spin"/>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Make question 3 easier."
            className="flex-1"
            rows={1}
            disabled={isRefining}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isRefining || !message.trim()}>
            {isRefining ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
