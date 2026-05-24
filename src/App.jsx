import React, { useState, useEffect } from 'react';
import { usePublications } from './usePublications';
import { useSearch } from './useSearch';
import { Display } from './types';
import Search from './components/Search';
import Introduction from './components/Introduction';
import Results from './components/Results';
import fitLogo from '../fit-logo.png';

function App() {
  const {
    publications,
    loadingStatus,
    loadingProgress,
    loadPublications,
    reloadPublications,
  } = usePublications();

  const {
    searchTerm,
    setSearchTerm,
    results,
    search,
    clearSearch,
  } = useSearch();

  const [currentView, setCurrentView] = useState(Display.HOME);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleSearch = () => {
    search(publications);
    setCurrentView(Display.RESULTS);
  };

  const navHome = () => {
    clearSearch();
    setCurrentView(Display.HOME);
  };

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="nav-bar" role="navigation">
        <div className="nav-wrapper">
          <a
            className="brand-logo"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navHome();
            }}
          >
            <img src={fitLogo} alt="FIT Logo" height="40" className="h-10 md:h-12 w-auto" />
            <span className="text-base md:text-lg">FIT Publications Database</span>
          </a>
        </div>

        {/* Progress bar */}
        <div
          className="progress-bar"
          style={{ display: loadingStatus ? 'block' : 'none' }}
        >
          <div
            className="progress-fill"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content">
        <Search
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearch={handleSearch}
          loadingStatus={loadingStatus}
          isHero={currentView === Display.HOME}
        />

        {currentView === Display.HOME && <Introduction />}
        {currentView === Display.RESULTS && <Results results={results} />}

        {/* Floating action buttons */}
        <div className="floating-action-btn hidden md:block">
          <button className="fab-button large" aria-label="Menu">
            <span className="text-2xl">&#9776;</span>
          </button>
          <div className="flex flex-col mt-2.5">
            <button
              className="fab-button red"
              id="btn-home"
              onClick={navHome}
              aria-label="Home"
            >
              <span>&#8962;</span>
            </button>
            <button
              className="fab-button yellow"
              id="btn-refresh"
              onClick={reloadPublications}
              style={{
                boxShadow: loadingStatus ? '0 0 0 3px rgba(255,235,59,0.5)' : 'none',
              }}
              aria-label="Refresh"
            >
              <span>&#8635;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="text-center-custom">
            @2013 Falkland Islands Trust
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
