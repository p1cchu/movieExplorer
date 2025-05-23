"use client";

import Image from 'next/image';
import type { Movie } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.imdbID);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={movie.Poster === "N/A" ? "https://placehold.co/300x450.png" : movie.Poster}
            alt={`Poster for ${movie.Title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="movie poster"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2">
        <CardTitle className="text-lg font-semibold leading-tight truncate" title={movie.Title}>
          {movie.Title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {movie.Year} &bull; {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t dark:border-gray-700">
        <Button
          variant={favorite ? "destructive" : "outline"}
          size="sm"
          onClick={handleToggleFavorite}
          className="w-full transition-colors duration-300"
          aria-label={favorite ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
        >
          {favorite ? <Heart className="mr-2 h-4 w-4 fill-current" /> : <Heart className="mr-2 h-4 w-4" />}
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </Button>
      </CardFooter>
    </Card>
  );
}
