import React, { useState, useRef, useEffect } from 'react';

/**
 * Results component - displays search results in an expandable Card layout.
 * Uses FLIP-style animations for smooth transitions between search states.
 */
function Results({ results }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const prevResultsRef = useRef([]);
  const itemRefs = useRef({});
  const [animatingIds, setAnimatingIds] = useState(new Set());

  // Track which items are new, removed, or unchanged between result sets
  useEffect(() => {
    const prevResults = prevResultsRef.current;
    const prevIds = new Set(prevResults.map(r => r.id));
    const currentIds = new Set(results.map(r => r.id));

    // Find new items that need entrance animation
    const newIds = new Set();
    results.forEach(pub => {
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

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 transition-opacity duration-300 ease-out">
        <p className="text-xl text-gray-500">No publications found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pb-4 font-bold text-gray-700 text-lg flex items-center justify-between transition-opacity duration-200 ease-out">
        <span>{results.length} result{results.length === 1 ? '' : 's'} found</span>
      </div>

      <div className="flex flex-col gap-4">
        {results.map((pub) => {
          const isExpanded = expandedCard === pub.id;
          const isNew = animatingIds.has(pub.id);

          return (
            <div
              ref={(el) => { itemRefs.current[pub.id] = el; }}
              key={pub.id}
              className={`
                bg-white rounded-xl border overflow-hidden cursor-pointer
                transition-all duration-300 ease-out
                ${isNew
                  ? 'opacity-0 translate-y-4'
                  : 'opacity-100 translate-y-0'
                }
                ${isExpanded
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                }
              `}
              onClick={() => toggleExpandCard(pub.id)}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-2">
                      {pub.title}
                    </h3>
                    <div className="text-sm md:text-base text-gray-600 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{pub.authors}</span>
                      <span className="text-gray-400">&bull;</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">{pub.year}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0 mt-1">
                    <span className={`inline-block w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-50 text-primary' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Expanded Detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono bg-gray-200 text-gray-600 px-2 py-1 rounded">ID: #{pub.id}</span>
                  </div>

                  <div className="space-y-3">
                    {pub.reference && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Reference</h4>
                        <p className="text-gray-800 text-sm">{pub.reference}</p>
                      </div>
                    )}
                    {pub.keywords && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Keywords</h4>
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
