'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '../icons';

export function AppHeader() {
  return (
    <header className="flex items-center gap-4 border-b p-2 pl-4 h-14">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight">QuizDistiller</h1>
      </div>
    </header>
  );
}
