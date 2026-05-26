import { useState, useRef, useEffect, ChangeEvent } from 'react';
import type { Publication } from '../types';

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'year-asc', label: 'Year (Oldest)' },
  { value: 'year-desc', label: 'Year (Newest)' },
];

interface ResultsProps {
  results: Publication[];
}

function Results({ results }: ResultsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('title-asc');
  const prevResultsRef = useRef<Publication[]>([]);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  // Sort results based on selected sort option
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'year-asc':
        return parseInt(a.year, 10) - parseInt(b.year, 10);
      case 'year-desc':
        return parseInt(b.year, 10) - parseInt(a.year, 10);
      case 'title-asc':
      default:
        return a.title.localeCompare(b.title);
    }
  });

  // Track which items are new, removed, or unchanged between result sets
  useEffect(() => {
    const prevResults = prevResultsRef.current;
    const prevIds = new Set(prevResults.map((r) => r.id));
    const currentIds = new Set(results.map((r) => r.id));

    // Find new items that need entrance animation
    const newIds = new Set<string>();
    results.forEach((pub) => {
      if (!prevIds.has(pub.id)) {
        newIds.add(pub.id);
      }
    });

    if (newIds.size > 0) {
      setAnimatingIds(newIds);
      // Clear animation state after transition completes
      const timer = setTimeout(() => {
        setAnimatingIds(new Set());
      }, 400);
      return () => clearTimeout(timer);
    }

    prevResultsRef.current = results;
  }, [results]);

  const toggleExpandCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 transition-opacity duration-300 ease-out">
        <p className="text-xl text-gray-500">
          No publications found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pb-4 font-medium text-gray-500 text-base flex items-center justify-between transition-opacity duration-200 ease-out">
        <span>
          {results.length} result{results.length === 1 ? '' : 's'} found
        </span>

        {/* Sort Dropdown */}
        <div className="flex items-center">
          <label htmlFor="sort-select" className="text-sm text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-300 transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sortedResults.map((pub) => {
          const isExpanded = expandedCard === pub.id;
          const isNew = animatingIds.has(pub.id);

          return (
            <div
              ref={(el) => {
                itemRefs.current[pub.id] = el;
              }}
              key={pub.id}
              className={`
                bg-white rounded-xl border overflow-hidden cursor-pointer
                transition-all duration-300 ease-out
                ${
                  isNew
                    ? 'opacity-0 translate-y-4'
                    : 'opacity-100 translate-y-0'
                }
                ${
                  isExpanded
                    ? 'border-primary shadow-md'
                    : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                }
              `}
              onClick={() => toggleExpandCard(pub.id)}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-700 leading-snug mb-2">
                      {pub.title}
                    </h3>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                      <span className="text-gray-600">{pub.authors}</span>
                      <span className="text-gray-400">&bull;</span>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                        {pub.year}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    <span
                      className={`flex w-8 h-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-50 text-primary' : ''}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Expanded Detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      ID: #{pub.id}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pub.reference && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                          Reference
                        </h4>
                        <p className="text-gray-800 text-sm">{pub.reference}</p>
                      </div>
                    )}
                    {pub.keywords && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                          Keywords
                        </h4>
                        <p className="text-gray-800 text-sm">{pub.keywords}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
