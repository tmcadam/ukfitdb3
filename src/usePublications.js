import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import publicationsCSV from './publications.csv?raw';

export function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const parseCSV = useCallback((csvData) => {
    const results = Papa.parse(csvData, { header: true });
    if (!results.data) return [];
    
    return results.data
      .filter((row) => row.id && row.id !== '#REF!')
      .map((row) => ({
        id: row.id || '',
        title: row.title || '',
        year: row.year || '',
        reference: row.reference || '',
        authors: row.authors || '',
        keywords: row.keywords || '',
        format: row.format || '',
      }));
  }, []);

  const cleanYears = useCallback((pubs) => {
    return pubs.map((pub) => ({
      ...pub,
      year: pub.year === '0' ? '-' : pub.year,
    }));
  }, []);

  const loadPublications = useCallback(() => {
    setLoadingStatus(true);
    try {
      const parsed = parseCSV(publicationsCSV);
      const cleaned = cleanYears(parsed);
      setPublications(cleaned);
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoadingStatus(false);
    }
  }, [parseCSV, cleanYears]);

  return {
    publications,
    loadingStatus,
    loadingProgress: '100%',
    loadPublications,
    reloadPublications: loadPublications,
    loadFromCSV: loadPublications,
    parseCSV,
    cleanYears,
    checkValidRow: (row) => row.id && row.id !== '#REF!'
  };
}
