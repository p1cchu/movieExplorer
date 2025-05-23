"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextProps {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (imdbID: string) => void;
  isFavorite: (imdbID: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("movieExplorerFavorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("movieExplorerFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);

  const addFavorite = (movie: Movie) => {
    if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
      toast({
        title: "Added to Favorites",
        description: `${movie.Title} has been added to your favorites.`,
      });
    }
  };

  const removeFavorite = (imdbID: string) => {
    const movieToRemove = favorites.find(fav => fav.imdbID === imdbID);
    setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.imdbID !== imdbID));
    if (movieToRemove) {
      toast({
        title: "Removed from Favorites",
        description: `${movieToRemove.Title} has been removed from your favorites.`,
        variant: "destructive",
      });
    }
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some(fav => fav.imdbID === imdbID);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
