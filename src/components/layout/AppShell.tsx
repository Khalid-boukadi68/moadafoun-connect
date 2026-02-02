import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {children}
        </div>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
