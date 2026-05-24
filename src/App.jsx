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
    <div className="App">
      {/* Navbar */}
      <nav className="blue nav-bar" role="navigation">
        <div className="nav-wrapper container">
          <a
            className="brand-logo left desktop-only"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navHome();
            }}
          >
            <img src={fitLogo} alt="FIT Logo" height="50" />
            <span className="brand-text">FIT Publications Database</span>
          </a>
          <a
            className="brand-logo left mobile-only"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navHome();
            }}
          >
            <img src={fitLogo} alt="FIT Logo" height="40" />
            <span className="brand-text-small">FIT Publications Database</span>
          </a>
        </div>

        {/* Progress bar */}
        <div
          className="progress"
          style={{ display: loadingStatus ? 'block' : 'none' }}
        >
          <div
            className="determinate blue darken-2"
            style={{ width: loadingProgress }}
          ></div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container main-content">
        <Search
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearch={handleSearch}
          loadingStatus={loadingStatus}
        />

        {currentView === Display.HOME && <Introduction />}
        {currentView === Display.RESULTS && <Results results={results} />}

        {/* Floating action buttons */}
        <div className="fixed-action-btn vertical click-to-toggle desktop-only">
          <a className="btn-floating btn-large green">
            <i className="large material-icons">menu</i>
          </a>
          <ul>
            <li>
              <a
                className="btn-floating red"
                id="btn-home"
                onClick={navHome}
              >
                <i className="material-icons">home</i>
              </a>
            </li>
            <li>
              <a
                className="btn-floating yellow darken-1"
                id="btn-refresh"
                onClick={reloadPublications}
                style={{
                  boxShadow: loadingStatus ? '0 0 0 3px rgba(255,235,59,0.5)' : 'none',
                }}
              >
                <i className="material-icons">refresh</i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="blue z-depth-2">
          <div className="container copyright">
            <span className="center-align copyright">
              &copy; 2013-18 Falkland Islands Trust
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
