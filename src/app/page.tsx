
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, OMDbSearchResponse } from '@/types';
import { MovieCard } from '@/components/MovieCard';
import { SearchBar } from '@/components/SearchBar';
import { PaginationControls } from '@/components/PaginationControls';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Film, Info } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import { useCachedFetch } from '@/hooks/useCachedFetch';
import { API_KEY } from '@/api-config'; // Import API_KEY

const ITEMS_PER_PAGE = 10;

const TOO_MANY_RESULTS_ERROR_KEY = "TOO_MANY_RESULTS_ERROR"; // Internal key

export default function HomePage() {
  const [inputValue, setInputValue] = useState<string>(""); // Raw input from search bar
  const debouncedInputValue = useDebounce(inputValue, 500); // Debounced version of raw input
  const [searchTermForApi, setSearchTermForApi] = useState<string>(""); // Actual term used for API requests

  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [initialSearchDone, setInitialSearchDone] = useState<boolean>(false);
  
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const { data: movieData, isLoading: moviesLoading, error: fetchError } = useCachedFetch<OMDbSearchResponse>(apiUrl);
  const [displayError, setDisplayError] = useState<string | null>(null); // For UI error messages

  const prevSearchTermForApiRef = useRef<string>();

  // Effect to update searchTermForApi from debounced input
  useEffect(() => {
    if (debouncedInputValue.trim() || !inputValue.trim()) {
        setSearchTermForApi(debouncedInputValue);
    }
  }, [debouncedInputValue, inputValue]);

  // Effect to reset current page when the actual API search term changes
  useEffect(() => {
    if (searchTermForApi !== prevSearchTermForApiRef.current) {
      if (searchTermForApi.trim()) {
        setCurrentPage(1);
      }
      prevSearchTermForApiRef.current = searchTermForApi;
    }
  }, [searchTermForApi]);

  // Effect to construct API URL when search term or page changes
  useEffect(() => {
    if (searchTermForApi.trim()) {
      setInitialSearchDone(true); // Mark that a search attempt will be made
      setApiUrl(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTermForApi)}&page=${currentPage}&type=movie`);
    } else {
      setInitialSearchDone(false);
      setSearchResults([]);
      setTotalPages(0);
      setDisplayError(null);
      setApiUrl(null); // Clear API URL if search term is empty
    }
  }, [searchTermForApi, currentPage]);


  // Effect to process data from useCachedFetch
  useEffect(() => {
    if (moviesLoading) {
      setDisplayError(null); // Clear UI error when loading
      // Skeletons will be shown based on moviesLoading
      return;
    }

    if (fetchError) {
      console.error("Failed to fetch movies (from hook):", fetchError);
      if (fetchError.message.includes("Too many results")) {
        setDisplayError(TOO_MANY_RESULTS_ERROR_KEY);
      } else {
        setDisplayError(fetchError.message);
      }
      setSearchResults([]);
      setTotalPages(0);
      return;
    }

    if (movieData) {
      if (movieData.Response === "True" && movieData.Search) {
        setSearchResults(movieData.Search);
        setTotalPages(Math.ceil(Number(movieData.totalResults) / ITEMS_PER_PAGE));
        setDisplayError(null);
      } else {
        setSearchResults([]);
        setTotalPages(0);
        if (movieData.Error === "Too many results.") {
          setDisplayError(TOO_MANY_RESULTS_ERROR_KEY);
        } else {
          // Handle "Movie not found." and other OMDb errors that come in a valid JSON response
          setDisplayError(movieData.Error || (searchTermForApi.trim() ? "No movies found." : null) );
        }
      }
    } else if (!apiUrl && !searchTermForApi.trim()) {
        // If no apiUrl and no search term, ensure everything is reset (initial state or cleared search)
        setSearchResults([]);
        setTotalPages(0);
        setDisplayError(null);
        setInitialSearchDone(false);
    }
  }, [movieData, moviesLoading, fetchError, apiUrl, searchTermForApi]);


  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      // If user submits, use the current inputValue immediately for the API search term
      setSearchTermForApi(inputValue);
      // The useEffect for searchTermForApi will reset currentPage if needed and then trigger API URL update.
    } else {
      // If submitting an empty form, clear everything
      setInputValue(""); // Ensure input visually clears
      setSearchTermForApi("");
      // Other state (searchResults, totalPages, displayError, initialSearchDone) will be reset by useEffects
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const MovieListSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: ITEMS_PER_PAGE / 2 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );

  const CardSkeleton = () => (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow-sm bg-card">
      <Skeleton className="h-[250px] w-full rounded-md" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <Skeleton className="h-8 w-full rounded-md mt-2" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          onSearchSubmit={handleSearchSubmit}
          isLoading={moviesLoading} // Use loading state from the hook
        />
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <Terminal className="mr-2 h-6 w-6 text-primary/80" />
          Search Results
        </h2>
        <Separator />
        {moviesLoading && <MovieListSkeleton />}
        {!moviesLoading && displayError && (
          displayError === TOO_MANY_RESULTS_ERROR_KEY ? (
            <Alert variant="default" className="shadow-md border-primary text-primary bg-primary/10">
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>Too many results, please adjust your search query.</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="shadow-md">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )
        )}
        {!moviesLoading && !displayError && searchResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map(movie => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={moviesLoading}
            />
          </>
        )}
        {!moviesLoading && !displayError && searchResults.length === 0 && initialSearchDone && searchTermForApi.trim() && (
            <Alert className="shadow-md">
            <Film className="h-4 w-4" />
            <AlertTitle>No Results</AlertTitle>
            <AlertDescription>No movies found for "{searchTermForApi}". Try a different search term.</AlertDescription>
            </Alert>
        )}
        {!moviesLoading && !displayError && !initialSearchDone && !searchTermForApi.trim() && (
            <Alert className="shadow-md">
            <Film className="h-4 w-4" />
            <AlertTitle>Ready to Explore?</AlertTitle>
            <AlertDescription>Type a movie title in the search bar above to see results.</AlertDescription>
            </Alert>
        )}
      </section>
    </div>
  );
}
