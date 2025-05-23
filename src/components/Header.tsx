
"use client";

import Link from 'next/link';
import { Film, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Go to homepage">
          <Film className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Movie Explorer
          </h1>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/90 px-2" aria-label="View Favorites">
            <Link href="/favorites">
              <Star className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

