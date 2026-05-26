import { useState } from 'react';

const MIN_SEARCH_LENGTH = 3;

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const search = (publications) => {
    if (!searchTerm.trim() || searchTerm.trim().length < MIN_SEARCH_LENGTH) {
      setResults([]);
      return;
    }

    let words = [];
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
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    search,
    clearSearch,
  };
}
