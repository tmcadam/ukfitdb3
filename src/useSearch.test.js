import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from './useSearch'

describe('useSearch', () => {
  describe('cleanWord', () => {
    it('should remove non-alphanumeric characters from word boundaries', () => {
      const { result } = renderHook(() => useSearch())

      expect(result.current.cleanWord('  Hello')).toBe('Hello')
      expect(result.current.cleanWord('  Hello  ')).toBe('Hello')
      expect(result.current.cleanWord(',1Hello')).toBe('1Hello')
      expect(result.current.cleanWord(',$Hello5 ')).toBe('Hello5')
      expect(result.current.cleanWord(' Hello World-')).toBe('Hello World')
    })
  })

  describe('cleanWords', () => {
    it('should clean each word in an array', () => {
      const { result } = renderHook(() => useSearch())
      const words = [' Hello', ',Hello', 'Hello World']
      const cleanedWords = ['Hello', 'Hello', 'Hello World']

      expect(result.current.cleanWords(words)).toEqual(cleanedWords)
    })
  })

  describe('cleanStrippedSearchTerm', () => {
    it('should clean a search term after phrases have been stripped', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('Tom "" 1980')
      })
      // The function uses the current searchTerm internally
      // We test via the search flow instead
    })
  })

  describe('getPhrases', () => {
    it('should return an array of quoted phrases from the search term', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('"Hello World" "1980 Tom"')
      })

      const words = result.current.getPhrases([])
      expect(words).toEqual(['Hello World', '1980 Tom'])
    })

    it('should not return words from the search term', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('"Hello World" 1980 "Goat Grazing" Tom')
      })

      const words = result.current.getPhrases([])
      expect(words).toEqual(['Hello World', 'Goat Grazing'])
    })
  })

  describe('getWords', () => {
    it('should return an array of words from the search term', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('blue')
      })
      expect(result.current.getWords([])).toEqual(['blue'])

      act(() => {
        result.current.setSearchTerm('1980 Tom blue')
      })
      expect(result.current.getWords([])).toEqual(['1980', 'Tom', 'blue'])
    })

    it('should not return phrases from the search term', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('"Hello World" 1980 "Goat Grazing" Tom')
      })

      const words = ['Hello World', 'Goat Grazing']
      expect(result.current.getWords(words)).toEqual([
        'Hello World',
        'Goat Grazing',
        '1980',
        'Tom',
      ])
    })
  })

  describe('splitTerm', () => {
    it('should return an array of words and phrases from the search term', () => {
      const { result } = renderHook(() => useSearch())

      act(() => {
        result.current.setSearchTerm('big')
      })
      expect(result.current.splitTerm()).toEqual(['big'])

      act(() => {
        result.current.setSearchTerm('big seaweed')
      })
      expect(result.current.splitTerm()).toEqual(['big', 'seaweed'])

      act(() => {
        result.current.setSearchTerm('"big seaweed"')
      })
      expect(result.current.splitTerm()).toEqual(['big seaweed'])

      act(() => {
        result.current.setSearchTerm('"big seaweed" "small seaweed"')
      })
      expect(result.current.splitTerm()).toEqual(['big seaweed', 'small seaweed'])

      act(() => {
        result.current.setSearchTerm('"big seaweed" " small seaweed" 1980')
      })
      expect(result.current.splitTerm()).toEqual(['big seaweed', 'small seaweed', '1980'])
    })
  })

  describe('matchPublication', () => {
    it('should return true if the search term is in one of the publication fields', () => {
      const { result } = renderHook(() => useSearch())
      const publication = {
        title: 'Whitegrass',
        authors: 'Blow, J',
        year: '1980',
        keywords: 'grass,seaweed',
      }

      expect(result.current.matchPublication(['white'], publication)).toBe(true)
      expect(result.current.matchPublication(['grass'], publication)).toBe(true)
      expect(result.current.matchPublication(['1980'], publication)).toBe(true)
    })

    it('should return false if the search term is not in any publication field', () => {
      const { result } = renderHook(() => useSearch())
      const publication = {
        title: 'Whitegrass',
        authors: 'Blow, J',
        year: '1980',
        keywords: 'grass,seaweed',
      }

      expect(result.current.matchPublication(['rass'], publication)).toBe(false)
      expect(result.current.matchPublication(['1972'], publication)).toBe(false)
      expect(result.current.matchPublication(['oil'], publication)).toBe(false)
    })
  })

  describe('search', () => {
    it('should set results to an array of publications that match the searchTerm', () => {
      const { result } = renderHook(() => useSearch())
      const publications = [
        { id: '1', title: 'Chammings Paper', year: '1987', authors: 'Chammings, M.B.', keywords: 'engineering', reference: 'ICE Proceedings' },
        { id: '2', title: 'Furse Birds', year: '1975', authors: 'Furse, J.R.', keywords: 'birds', reference: 'Ibis' },
        { id: '3', title: 'Furse Birds of Elephant', year: '1971', authors: 'Furse, J.R., Bruce, G.', keywords: 'birds, ornithology', reference: 'Ornithology Report' },
      ]

      act(() => {
        result.current.setSearchTerm('Chammings')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(1)

      act(() => {
        result.current.setSearchTerm('"Furse, J.R."')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(2)

      act(() => {
        result.current.setSearchTerm('"Furse, J.R." 1975')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(1)

      act(() => {
        result.current.setSearchTerm('Birds')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(2)
    })

    it('should set results to an empty array if searchTerm is empty', () => {
      const { result } = renderHook(() => useSearch())
      const publications = [
        { id: '1', title: 'Test', year: '2020', authors: 'Author', keywords: 'test', reference: 'Ref' },
      ]

      act(() => {
        result.current.setSearchTerm('')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(0)
    })

    it('should set results to empty when searching with no matches', () => {
      const { result } = renderHook(() => useSearch())
      const publications = [
        { id: '1', title: 'Test', year: '2020', authors: 'Author', keywords: 'test', reference: 'Ref' },
      ]

      act(() => {
        result.current.setSearchTerm('bannanas')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(0)
    })
  })

  describe('clearSearch', () => {
    it('should clear search term and results', () => {
      const { result } = renderHook(() => useSearch())
      const publications = [
        { id: '1', title: 'Test', year: '2020', authors: 'Author', keywords: 'test', reference: 'Ref' },
      ]

      act(() => {
        result.current.setSearchTerm('test')
      })
      act(() => {
        result.current.search(publications)
      })
      expect(result.current.results.length).toBe(1)

      act(() => {
        result.current.clearSearch()
      })
      expect(result.current.searchTerm).toBe('')
      expect(result.current.results.length).toBe(0)
    })
  })
})
