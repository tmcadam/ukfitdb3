import { useState, useCallback, useRef } from 'react';
import type { Publication } from './types';

// Declare _paq for Matomo tracking
declare global {
  interface Window {
    _paq: unknown[];
  }
}

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 2000; // milliseconds

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined' && window.location) {
      const pathname = window.location.pathname || '';
      if (pathname === '/search' || pathname.endsWith('/search')) {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
      }
    }
    return '';
  });
  const [results, setResults] = useState<Publication[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback((publications: Publication[]) => {
    if (!searchTerm.trim() || searchTerm.trim().length < MIN_SEARCH_LENGTH) {
      setResults([]);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce resetting the URL
      debounceTimerRef.current = setTimeout(() => {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          if (url.pathname !== '/') {
            window.history.pushState({}, '', '/');
          }
        }
      }, DEBOUNCE_DELAY);
      return;
    }

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to update URL with search query after 2000ms of inactivity
    // Matomo automatically detects ?q= parameter in the URL for Site Search tracking
    debounceTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.pathname = '/search';
        url.searchParams.set('q', searchTerm.trim());
        window.history.pushState({}, '', url);
        // Explicitly track the page view change in Matomo
        if (window._paq) {
          window._paq.push(['setCustomUrl', url.toString()]);
          window._paq.push(['trackPageView']);
        }
      }
    }, DEBOUNCE_DELAY);

    let words: string[] = [];
    let stripped = searchTerm;
    const quoteRe = /"([^"]*)"/g;
    let match;

    while ((match = quoteRe.exec(searchTerm)) !== null) {
      words.push(match[1]);
      stripped = stripped.replace(match[0], '');
    }

    const wordRe = /\w+/g;
    const matches = stripped.match(wordRe);
    if (matches) {
      words = words.concat(matches);
    }

    const searchWords = words.map((w) => w.replace(/(^\W+)|(\W+$)/g, ''));

    const filtered = publications.filter((pub) => {
      return searchWords.every((word) => {
        const pattern = new RegExp(
          '\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        return (
          pattern.test(pub.title) ||
          pattern.test(pub.keywords) ||
          pattern.test(pub.authors) ||
          pattern.test(pub.year)
        );
      });
    });

    filtered.sort((a, b) => a.title.localeCompare(b.title));

    setResults(filtered);
  }, [searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    // Clear the URL by resetting to root path
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    search,
    clearSearch,
  };
}
