'use client';

import * as React from 'react';
import type { Session } from '@/lib/types';
import {
  SidebarContent as SidebarContentArea,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '../ui/sidebar';
import { FileText, PlusCircle } from 'lucide-react';
import { Logo } from '../icons';
import { formatDistanceToNow } from 'date-fns';

type SidebarContentProps = {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
};

export function SidebarContent({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
}: SidebarContentProps) {
  const { state } = useSidebar();
  
  return (
    <SidebarContentArea>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 text-primary" />
          {state === 'expanded' && (
            <span className="font-semibold text-lg">Quizify</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onNewSession} isActive={!activeSessionId}>
            <PlusCircle />
            <span>New Quiz</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {sessions.length > 0 && (
        <SidebarGroup>
          <SidebarMenu>
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  onClick={() => onSelectSession(session.id)}
                  isActive={activeSessionId === session.id}
                  tooltip={session.fileName}
                >
                  <FileText />
                  <div className="flex flex-col items-start w-full overflow-hidden">
                    <span className="truncate">{session.fileName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </SidebarContentArea>
  );
}
