
"use client";

import type { FormEvent } from 'react';
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (term: string) => void;
  onSearchSubmit: () => void;
  isLoading?: boolean; // Prop is kept for potential future use, but not for disabling input
}

export function SearchBar({ value, onChange, onSearchSubmit }: SearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim()) {
      onSearchSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search for movies (e.g., Star Wars, The Matrix)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow rounded-md shadow-sm focus:ring-primary focus:border-primary pl-10" // Added pl-10 for icon padding
          aria-label="Search for movies"
          // The input is no longer disabled when isLoading is true
        />
      </div>
    </form>
  );
}
