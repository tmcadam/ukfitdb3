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
      <div className="row search">
        <div className="input-field col s1"></div>
        <div className="input-field col s8 m8 l9">
          <input
            id="searchInput"
            type="text"
            className="form-control"
            placeholder="Enter a search term"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="input-field col s3 m3 l2">
          <a
            className="waves-effect waves-light btn desktop-only search-btn"
            id="searchButton"
            onClick={onSearch}
            style={{ opacity: loadingStatus ? 0.5 : 1, pointerEvents: loadingStatus ? 'none' : 'auto' }}
          >
            <i className="material-icons align-center">search</i>
          </a>
          <a
            className="waves-effect waves-light mobile-only search-btn"
            id="searchButton"
            onClick={onSearch}
            style={{ opacity: loadingStatus ? 0.5 : 1, pointerEvents: loadingStatus ? 'none' : 'auto' }}
          >
            <i className="material-icons">search</i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Search;
