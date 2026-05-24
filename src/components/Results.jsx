import React, { useState } from 'react';

/**
 * Results component - displays search results in an expandable Card layout.
 */
function Results({ results }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">No publications found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pb-4 font-bold text-gray-700 text-lg flex items-center justify-between">
        <span>{results.length} result{results.length === 1 ? '' : 's'} found</span>
      </div>
      
      <div className="flex flex-col gap-4">
        {results.map((pub) => {
          const isExpanded = expandedCard === pub.id;
          
          return (
            <div 
              key={pub.id} 
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                isExpanded ? 'border-primary shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
              }`}
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
