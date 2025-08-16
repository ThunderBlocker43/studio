import { Building2 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-6 shrink-0">
      <div className="flex items-center gap-2 text-primary">
        <Building2 className="h-6 w-6" />
        <span className="text-xl font-bold font-headline">Staybase</span>
      </div>
    </header>
  );
}
