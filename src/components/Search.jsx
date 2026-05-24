import React from 'react';

/**
 * Search component - provides search input and button.
 * Mirrors the Angular SearchComponent.
 */
function Search({ searchTerm, onSearchTermChange, onSearch, loadingStatus }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            id="searchInput"
            type="text"
            className="search-input"
            placeholder="Enter a search term"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="sm:w-32">
          <button
            className="search-btn desktop-only"
            id="searchButton"
            onClick={onSearch}
            disabled={loadingStatus}
          >
            <span className="text-xl">&#128269;</span>
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            className="search-btn mobile-only"
            id="searchButton"
            onClick={onSearch}
            disabled={loadingStatus}
          >
            <span className="text-xl">&#128269;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
