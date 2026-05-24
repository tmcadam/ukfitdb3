import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

// Mock the hooks
vi.mock('./usePublications', () => ({
  usePublications: () => ({
    publications: [
      {
        id: '1',
        title: 'Test Publication One',
        year: '2020',
        reference: 'Journal of Testing, 1(1), 10-20',
        authors: 'Smith, J., Doe, A.',
        keywords: 'testing, mock, example',
        format: 'Scientific Paper',
      },
      {
        id: '2',
        title: 'Another Test Publication',
        year: '2021',
        reference: 'Test Journal, 2(2), 30-40',
        authors: 'Brown, B.',
        keywords: 'example, research',
        format: 'Scientific Paper',
      },
    ],
    loadingStatus: false,
    loadingProgress: '0%',
    loadPublications: vi.fn(),
    reloadPublications: vi.fn(),
  }),
}))

vi.mock('./useSearch', () => ({
  useSearch: () => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
    results: [],
    search: vi.fn((publications) => []),
    clearSearch: vi.fn(),
  }),
}))

// Mock the components that use images
vi.mock('./components/Introduction', () => ({
  default: () => (
    <div className="introduction-container">
      <h5>Welcome to the FIT Publications Database</h5>
      <p>
        Welcome to your Publications App boilerplate. :-)
      </p>
    </div>
  ),
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main app container', () => {
    render(<App />)
    const appContainer = document.querySelector('.App')
    expect(appContainer).toBeInTheDocument()
  })

  it('renders the navigation bar', () => {
    render(<App />)
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<App />)
    const searchInput = document.getElementById('searchInput')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders the search button', () => {
    render(<App />)
    const searchButton = document.getElementById('searchButton')
    expect(searchButton).toBeInTheDocument()
  })

  it('renders the introduction content', () => {
    render(<App />)
    const heading = screen.getByText(/Welcome to the FIT Publications Database/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<App />)
    const paragraphElement = screen.getByText(
      'Welcome to your Publications App boilerplate. :-)'
    )
    expect(paragraphElement).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<App />)
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders the floating action buttons', () => {
    render(<App />)
    const homeButton = document.getElementById('btn-home')
    expect(homeButton).toBeInTheDocument()
    const refreshButton = document.getElementById('btn-refresh')
    expect(refreshButton).toBeInTheDocument()
  })

  it('hides loading progress when not loading', () => {
    render(<App />)
    const progress = document.querySelector('div.progress')
    expect(progress).toHaveStyle({ display: 'none' })
  })

  it('renders FIT Publications Database in navbar', () => {
    render(<App />)
    const brandTexts = screen.getAllByText(/FIT Publications Database/i)
    expect(brandTexts.length).toBeGreaterThan(0)
  })

  it('renders placeholder text in search input', () => {
    render(<App />)
    const searchInput = document.getElementById('searchInput')
    expect(searchInput).toHaveAttribute('placeholder', 'Enter a search term')
  })
})
