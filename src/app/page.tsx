'use client';

import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Staybase</h1>
        <p className="text-lg text-muted-foreground mt-2">
          The page is loading. If you see this, the routing is fixed.
        </p>
      </main>
    </div>
  );
}
