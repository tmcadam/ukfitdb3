import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Results from './Results'

const mockResults = [
  {
    id: '1',
    title: 'Zebra Publishing',
    year: '2020',
    reference: 'Journal A',
    authors: 'Smith, J.',
    keywords: 'testing',
    format: 'Paper',
  },
  {
    id: '2',
    title: 'Alpha Research',
    year: '2021',
    reference: 'Journal B',
    authors: 'Jones, M.',
    keywords: 'research',
    format: 'Conference',
  },
  {
    id: '3',
    title: 'Middle Publishing',
    year: '2019',
    reference: 'Journal C',
    authors: 'Brown, K.',
    keywords: 'study',
    format: 'Book',
  },
]

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the result count', () => {
    render(<Results results={mockResults} />)
    expect(screen.getByText('3 results found')).toBeInTheDocument()
  })

  it('renders singular "result" for single result', () => {
    render(<Results results={[mockResults[0]]} />)
    expect(screen.getByText('1 result found')).toBeInTheDocument()
  })

  it('renders the sort dropdown with label', () => {
    render(<Results results={mockResults} />)
    expect(screen.getByText('Sort by:')).toBeInTheDocument()
  })

  it('has the sort dropdown with correct default value', () => {
    render(<Results results={mockResults} />)
    const select = document.getElementById('sort-select')
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('title-asc')
  })

  it('displays all four sort options', () => {
    render(<Results results={mockResults} />)
    const select = document.getElementById('sort-select')
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent('Title (A-Z)')
    expect(options[1]).toHaveTextContent('Title (Z-A)')
    expect(options[2]).toHaveTextContent('Year (Oldest)')
    expect(options[3]).toHaveTextContent('Year (Newest)')
  })

  it('sorts results by title ascending by default', () => {
    render(<Results results={mockResults} />)
    const cards = screen.getAllByRole('heading')
    expect(cards[0].textContent).toBe('Alpha Research')
    expect(cards[1].textContent).toBe('Middle Publishing')
    expect(cards[2].textContent).toBe('Zebra Publishing')
  })

  it('sorts by title descending when selected', () => {
    render(<Results results={mockResults} />)
    const select = document.getElementById('sort-select')
    fireEvent.change(select, { target: { value: 'title-desc' } })

    const cards = screen.getAllByRole('heading')
    expect(cards[0].textContent).toBe('Zebra Publishing')
    expect(cards[1].textContent).toBe('Middle Publishing')
    expect(cards[2].textContent).toBe('Alpha Research')
  })

  it('sorts by year ascending when selected', () => {
    render(<Results results={mockResults} />)
    const select = document.getElementById('sort-select')
    fireEvent.change(select, { target: { value: 'year-asc' } })

    const cards = screen.getAllByRole('heading')
    expect(cards[0].textContent).toBe('Middle Publishing') // 2019
    expect(cards[1].textContent).toBe('Zebra Publishing')  // 2020
    expect(cards[2].textContent).toBe('Alpha Research')    // 2021
  })

  it('sorts by year descending when selected', () => {
    render(<Results results={mockResults} />)
    const select = document.getElementById('sort-select')
    fireEvent.change(select, { target: { value: 'year-desc' } })

    const cards = screen.getAllByRole('heading')
    expect(cards[0].textContent).toBe('Alpha Research')    // 2021
    expect(cards[1].textContent).toBe('Zebra Publishing')  // 2020
    expect(cards[2].textContent).toBe('Middle Publishing') // 2019
  })

  it('renders no results message when empty', () => {
    render(<Results results={[]} />)
    expect(screen.getByText(/No publications found matching your search/)).toBeInTheDocument()
    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument()
  })

  it('preserves expandable card functionality', () => {
    render(<Results results={mockResults} />)
    const firstCard = mockResults[0]

    // Click to expand
    fireEvent.click(screen.getByText(firstCard.title))

    expect(screen.getByText(firstCard.reference)).toBeInTheDocument()
    expect(screen.getByText(`ID: #${firstCard.id}`)).toBeInTheDocument()
  })
})
