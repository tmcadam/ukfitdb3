import React, { useState, useEffect, useCallback } from 'react';
import { usePublications } from './usePublications';
import { useSearch } from './useSearch';
import { Display } from './types';
import Search from './components/Search';
import Introduction from './components/Introduction';
import Results from './components/Results';
import fitLogo from '../fit-logo.png';

function App() {
  const { publications, loadingStatus, loadPublications } = usePublications();

  const { searchTerm, setSearchTerm, results, search, clearSearch } =
    useSearch();

  const [currentView, setCurrentView] = useState(Display.HOME);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  useEffect(() => {
    if (searchTerm.trim()) {
      search(publications);
      if (currentView !== Display.RESULTS) {
        setCurrentView(Display.RESULTS);
      }
    }
  }, [searchTerm, publications, currentView, search]);

  useEffect(() => {
    if (searchTerm.trim() === '' && currentView === Display.RESULTS) {
      setCurrentView(Display.HOME);
    }
  }, [searchTerm, currentView]);

  const navHome = useCallback(() => {
    clearSearch();
    setCurrentView(Display.HOME);
  }, [clearSearch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-800 shadow-sm"
        role="navigation"
      >
        <div className="flex items-center px-4 py-3 max-w-6xl mx-auto">
          <a
            className="inline-flex items-center gap-3 text-gray-900 font-bold tracking-tight no-underline hover:opacity-80 transition-opacity"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navHome();
            }}
          >
            <img src={fitLogo} alt="FIT Logo" className="h-10 md:h-12 w-auto" />
            <span className="text-base md:text-lg">
              FIT Publications Database
            </span>
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        <Search
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          loadingStatus={loadingStatus}
          isHero={currentView === Display.HOME}
        />

        {currentView === Display.HOME && <Introduction />}
        {currentView === Display.RESULTS && <Results results={results} />}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 text-gray-600 py-6 text-center">
        @2013 Falkland Islands Trust
      </footer>
    </div>
  );
}

export default App;
