
"use client";

import { useState, useEffect, useRef } from 'react';

// Module-level cache to share across all instances of the hook
const cache = new Map<string, any>();
// Module-level map to track inflight requests
const inflightRequests = new Map<string, Promise<any>>();

export function useCachedFetch<T>(url: string | null | undefined): { data: T | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // useRef to track if the component is still mounted.
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!url) {
      if (isMountedRef.current) {
        setData(null);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    const fetchData = async () => {
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null); // Clear previous error for this URL
      }

      // Check cache first
      if (cache.has(url)) {
        if (isMountedRef.current) {
          setData(cache.get(url));
          setIsLoading(false);
        }
        return;
      }

      // Check for inflight request
      if (inflightRequests.has(url)) {
        try {
          const cachedPromise = inflightRequests.get(url)!;
          const responseData = await cachedPromise;
          if (isMountedRef.current) {
            setData(responseData);
            // The original fetcher will set the cache.
          }
        } catch (e) {
          if (isMountedRef.current) {
            setError(e as Error);
            setData(null);
          }
        } finally {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        }
        return;
      }

      // Start a new fetch
      const fetchPromise = fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            let errorData;
            try {
              // Try to parse error response from OMDb
              errorData = await response.json();
            } catch (jsonError) {
              // Ignore if response is not JSON, fall back to status text
            }
            const errorMessage = errorData?.Error || `HTTP error! status: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then((responseData: T) => {
          cache.set(url, responseData); // Cache the successful response
          if (isMountedRef.current) {
            setData(responseData);
          }
          return responseData; // For other awaiters of this inflight promise
        })
        .catch((e) => {
          if (isMountedRef.current) {
            setError(e as Error);
            setData(null); // Clear data on error
          }
          // Do not cache errors. If a previously successful request for this URL existed,
          // and now it failed, ensure it's removed from cache.
          if (cache.has(url)) {
            cache.delete(url);
          }
          throw e; // To reject the inflight promise for other awaiters
        })
        .finally(() => {
          inflightRequests.delete(url); // Remove from inflight once completed
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        });

      inflightRequests.set(url, fetchPromise);
    };

    fetchData();

  }, [url]); // Re-run effect if URL changes

  return { data, isLoading, error };
}
