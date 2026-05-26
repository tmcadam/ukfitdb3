import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

vi.mock('./usePublications', () => ({
  usePublications: () => ({
    publications: [
      {
        id: '1',
        title: 'Test Publication One',
        year: '2020',
        reference: 'Journal',
        authors: 'Smith, J.',
        keywords: 'testing',
        format: 'Paper',
      },
    ],
    loadingStatus: false,
    loadPublications: vi.fn(),
  }),
}));

vi.mock('./useSearch', () => ({
  useSearch: () => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
    results: [],
    search: vi.fn(),
    clearSearch: vi.fn(),
  }),
}));

vi.mock('./components/Introduction', () => ({
  default: () => (
    <div className="introduction-container">
      <h5>Welcome to the FIT Publications Database</h5>
      <p>Welcome to your Publications App boilerplate. :-)</p>
    </div>
  ),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the navigation bar', () => {
    render(<App />);
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<App />);
    const searchInput = document.getElementById('searchInput');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders the introduction content', () => {
    render(<App />);
    const heading = screen.getByText(
      /Welcome to the FIT Publications Database/i,
    );
    expect(heading).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<App />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders FIT Publications Database in navbar', () => {
    render(<App />);
    const brandTexts = screen.getAllByText(/FIT Publications Database/i);
    expect(brandTexts.length).toBeGreaterThan(0);
  });

  it('renders placeholder text in search input', () => {
    render(<App />);
    const searchInput = document.getElementById('searchInput');
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Enter a keyword, title, author, or year...',
    );
  });
});
