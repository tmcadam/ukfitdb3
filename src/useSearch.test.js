import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from './useSearch'

describe('useSearch', () => {

  const mockPublications = [
    {
      id: '1',
      title: 'Guide to Birds',
      authors: 'Chammings, A.',
      year: '1975',
      keywords: 'Birds, Habitat',
    },
    {
      id: '2',
      title: 'Marine Life',
      authors: 'Furse, J.R.',
      year: '1980',
      keywords: 'Ocean',
    },
    {
      id: '3',
      title: 'Birds of the Islands',
      authors: 'Furse, J.R.',
      year: '1975',
      keywords: 'Birds, Conservation',
    },
  ]

  describe('search', () => {
    it('should set results to an array of publications that match the searchTerm', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('Chammings')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results.length).toBe(1)
      expect(result.current.results[0].id).toBe('1')

      act(() => {
        result.current.setSearchTerm('"Furse, J.R."')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results.length).toBe(2)

      act(() => {
        result.current.setSearchTerm('"Furse, J.R." 1975')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results.length).toBe(1)
      expect(result.current.results[0].id).toBe('3')

      act(() => {
        result.current.setSearchTerm('Birds')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results.length).toBe(2)
    })

    it('should set results to an empty array if searchTerm is empty', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('   ')
      })
      act(() => {
        result.current.search(mockPublications)
      })

      expect(result.current.results).toEqual([])
    })

    it('should set results to empty when searching with no matches', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('bannanas')
      })
      act(() => {
        result.current.search(mockPublications)
      })

      expect(result.current.results).toEqual([])
    })
  })

  describe('minimum search length', () => {
    it('should not return results when search term has fewer than 3 characters', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('Ch')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results).toEqual([])
    })

    it('should return results when search term has 3 or more characters', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('Cha')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results.length).toBe(1)
      expect(result.current.results[0].id).toBe('1')
    })

    it('should return empty results for short search terms even if they match', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('B')
      })
      act(() => {
        result.current.search(mockPublications)
      })
      expect(result.current.results).toEqual([])
    })
  })

  describe('clearSearch', () => {
    it('should clear search term and results', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('test')
        result.current.search(mockPublications)
        result.current.clearSearch()
      })

      expect(result.current.searchTerm).toBe('')
      expect(result.current.results).toEqual([])
    })
  })
})
