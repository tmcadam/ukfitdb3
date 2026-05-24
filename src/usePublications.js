import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import publicationsCSV from './publications.csv?raw';

const CACHE_KEY = 'fitPublications';

/**
 * Hook to manage publications data loading, caching, and parsing.
 * Mirrors the Angular PublicationsService.
 */
export function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('0%');

  /**
   * Clean year values: replace '0' with '-'
   */
  const cleanYears = useCallback((pubs) => {
    return pubs.map((pub) => ({
      ...pub,
      year: pub.year === '0' ? '-' : pub.year,
    }));
  }, []);

  /**
   * Check if a row is valid (has non-empty, non-#REF! id)
   */
  const checkValidRow = useCallback((row) => {
    return row.id !== '' && row.id !== '#REF!';
  }, []);

  /**
   * Parse CSV data string into publications array
   */
  const parseCSV = useCallback((csvData) => {
    const results = Papa.parse(csvData, { header: true });
    if (results.data) {
      const parsed = results.data
        .filter((row) => checkValidRow(row))
        .map((row) => ({
          id: row.id || '',
          title: row.title || '',
          year: row.year || '',
          reference: row.reference || '',
          authors: row.authors || '',
          keywords: row.keywords || '',
          format: row.format || '',
        }));
      return parsed;
    }
    return [];
  }, [checkValidRow]);

  /**
   * Load publications from CSV
   */
  const loadFromCSV = useCallback(() => {
    setLoadingStatus(true);
    setLoadingProgress('0%');

    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress <= 95) {
        setLoadingProgress(`${progress}%`);
      }
    }, 50);

    try {
      const parsed = parseCSV(publicationsCSV);
      const cleaned = cleanYears(parsed);

      clearInterval(progressInterval);
      setLoadingProgress('100%');

      setPublications(cleaned);

      // Cache in sessionStorage
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cleaned));
      } catch (e) {
        console.warn('Could not cache publications to sessionStorage:', e);
      }

      console.log(`Loaded ${cleaned.length} publications from CSV.`);
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setTimeout(() => {
        setLoadingStatus(false);
        setLoadingProgress('0%');
      }, 500);
    }
  }, [parseCSV, cleanYears]);

  /**
   * Load publications - check cache first, then load from CSV
   */
  const loadPublications = useCallback(() => {
    // Try to load from sessionStorage
    let cached;
    try {
      cached = sessionStorage.getItem(CACHE_KEY);
    } catch (e) {
      console.warn('Could not access sessionStorage:', e);
    }

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPublications(parsed);
        console.log('Using cached publications data.');
        return;
      } catch (e) {
        console.warn('Could not parse cached publications:', e);
      }
    }

    loadFromCSV();
  }, [loadFromCSV]);

  /**
   * Reload publications from CSV (bypass cache)
   */
  const reloadPublications = useCallback(() => {
    console.log('Reloading data from source.');
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // ignore
    }
    loadFromCSV();
  }, [loadFromCSV]);

  return {
    publications,
    loadingStatus,
    loadingProgress,
    loadPublications,
    reloadPublications,
    loadFromCSV,
    // Expose helper functions for testing
    parseCSV,
    cleanYears,
    checkValidRow,
  };
}
