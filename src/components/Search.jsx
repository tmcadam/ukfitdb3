import React from 'react';

/**
 * Search component - provides search input and button.
 */
function Search({ searchTerm, onSearchTermChange, onSearch, loadingStatus, isHero }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`transition-all duration-500 ease-in-out ${isHero ? 'pb-2 md:pb-4 max-w-4xl mx-auto text-center' : 'mb-8 max-w-4xl mx-auto'}`}>
      {isHero && (
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore the Trust's Publications
          </h1>
          <p className="text-lg text-gray-600">
            Search our comprehensive database of documents, reports, and historic records.
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1">
          <input
            id="searchInput"
            type="text"
            className="w-full px-6 py-4 border border-gray-300 rounded-xl shadow-sm text-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="Enter a keyword, title, author, or year..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="sm:w-auto">
          <button
            id="searchButton"
            onClick={onSearch}
            disabled={loadingStatus}
            className="w-full sm:w-auto px-6 py-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
