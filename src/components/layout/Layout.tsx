import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 md:py-6">
        {children}
      </main>
    </div>
  );
}
