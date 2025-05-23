
"use client";

import * as React from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { MovieCard } from "./MovieCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesList() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a skeleton UI on the server and initial client render.
    // This avoids a structural mismatch when favorites are loaded from localStorage.
    return (
      <ScrollArea className="h-full pr-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-sm bg-card">
              <Skeleton className="h-[250px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-8 w-full rounded-md mt-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg min-h-[200px] bg-card h-full">
        <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Your favorites list is empty.</p>
        <p className="text-sm text-muted-foreground">Add movies by clicking the heart icon!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </ScrollArea>
  );
}
