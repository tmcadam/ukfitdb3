import { useState, useCallback } from 'react';

/**
 * Hook to manage search functionality.
 * Mirrors the Angular SearchService.
 */
export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  /**
   * Remove non-alphanumeric characters from word boundaries
   */
  const cleanWord = useCallback((word) => {
    return word.replace(/(^\W+)|(\W+$)/g, '');
  }, []);

  /**
   * Clean an array of words
   */
  const cleanWords = useCallback((words) => {
    return words.map((word) => cleanWord(word));
  }, [cleanWord]);

  /**
   * Clean stripped search term
   */
  const cleanStrippedSearchTerm = useCallback((term) => {
    term = term.replace(/"/g, '');
    term = term.replace(/  /g, ' ');
    return cleanWord(term);
  }, [cleanWord]);

  /**
   * Strip phrases (quoted text) from search term
   */
  const stripPhrasesFromSearchTerm = useCallback((_words) => {
    let stripped = searchTerm;
    _words.forEach((word) => {
      stripped = stripped.replace(word, '');
    });
    return cleanStrippedSearchTerm(stripped);
  }, [searchTerm, cleanStrippedSearchTerm]);

  /**
   * Extract quoted phrases from search term
   */
  const getPhrases = useCallback((words) => {
    const re = new RegExp('"([^"]*)"', 'g');
    let match;
    while ((match = re.exec(searchTerm)) !== null) {
      words.push(match[1]);
    }
    return words;
  }, [searchTerm]);

  /**
   * Extract individual words from search term
   */
  const getWords = useCallback((words) => {
    const stripped = stripPhrasesFromSearchTerm(words);
    const re = new RegExp('\\w+', 'g');
    const matches = stripped.match(re);
    if (matches) {
      words = words.concat(matches);
    }
    return words;
  }, [stripPhrasesFromSearchTerm]);

  /**
   * Split search term into words and phrases
   */
  const splitTerm = useCallback(() => {
    let words = [];
    words = getPhrases(words);
    words = getWords(words);
    words = cleanWords(words);
    return words;
  }, [getPhrases, getWords, cleanWords]);

  /**
   * Check if a publication matches all search words
   */
  const matchPublication = useCallback((searchWords, publication) => {
    return searchWords.every((word) => {
      const re = new RegExp('\\b' + word, 'i');
      return (
        publication.title.search(re) >= 0 ||
        publication.keywords.search(re) >= 0 ||
        publication.authors.search(re) >= 0 ||
        publication.year.search(re) >= 0
      );
    });
  }, []);

  /**
   * Execute search against publications
   */
  const search = useCallback((publications) => {
    if (searchTerm === '') {
      setResults([]);
      console.log(`Search Term: (empty) Found: 0`);
      return;
    }

    const searchWords = splitTerm();
    const filtered = publications.filter((pub) =>
      matchPublication(searchWords, pub)
    );
    setResults(filtered);
    console.log(`Search Term:${searchTerm} Found:${filtered.length}`);
  }, [searchTerm, splitTerm, matchPublication]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    search,
    clearSearch,
    // Expose helper functions for testing
    cleanWord,
    cleanWords,
    cleanStrippedSearchTerm,
    getPhrases,
    getWords,
    splitTerm,
    matchPublication,
  };
}
