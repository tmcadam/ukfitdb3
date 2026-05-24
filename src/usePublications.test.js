import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePublications } from './usePublications'

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
})

describe('usePublications', () => {
  beforeEach(() => {
    mockSessionStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadPublications', () => {
    it('should load publications from sessionStorage cache if available', () => {
      const cachedPubs = [
        { id: '1', title: 'Cached Pub', year: '2020', authors: 'Author', keywords: 'test', reference: 'Ref', format: 'Paper' },
      ]
      mockSessionStorage.setItem('fitPublications', JSON.stringify(cachedPubs))

      const { result } = renderHook(() => usePublications())

      act(() => {
        result.current.loadPublications()
      })

      expect(result.current.publications).toEqual(cachedPubs)
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('fitPublications')
    })

    it('should load from CSV if no cache is available', () => {
      const { result } = renderHook(() => usePublications())

      act(() => {
        result.current.loadPublications()
      })

      // Wait for async loading
      return new Promise((resolve) => {
        setTimeout(() => {
          act(() => {})
          expect(result.current.publications.length).toBeGreaterThan(0)
          resolve(null)
        }, 100)
      })
    })
  })

  describe('reloadPublications', () => {
    it('should bypass cache and reload from CSV', () => {
      const cachedPubs = [
        { id: '1', title: 'Old Pub', year: '2019', authors: 'Old Author', keywords: 'old', reference: 'Old Ref', format: 'Paper' },
      ]
      mockSessionStorage.setItem('fitPublications', JSON.stringify(cachedPubs))

      const { result } = renderHook(() => usePublications())

      act(() => {
        result.current.loadPublications()
      })

      // Verify cache was used initially
      expect(result.current.publications[0].title).toBe('Old Pub')

      // Now reload
      act(() => {
        result.current.reloadPublications()
      })

      return new Promise((resolve) => {
        setTimeout(() => {
          act(() => {})
          expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('fitPublications')
          resolve(null)
        }, 100)
      })
    })
  })

  describe('loadingStatus', () => {
    it('should set loadingStatus to true during loading', () => {
      const { result } = renderHook(() => usePublications())

      expect(result.current.loadingStatus).toBe(false)

      act(() => {
        result.current.loadFromCSV()
      })

      expect(result.current.loadingStatus).toBe(true)
    })
  })

  describe('parseCSV', () => {
    it('should parse CSV data and return publications array', () => {
      const { result } = renderHook(() => usePublications())

      const csvData = `id,title,year,reference,authors,keywords,format
1,Test Publication,2020,Test Journal,Test Author,test keywords,Scientific Paper
2,Another Pub,2021,Another Journal,Another Author,another keyword,Report`

      const resultHook = result.current
      const parsed = resultHook.parseCSV(csvData)

      expect(parsed).toHaveLength(2)
      expect(parsed[0].id).toBe('1')
      expect(parsed[0].title).toBe('Test Publication')
      expect(parsed[0].year).toBe('2020')
    })

    it('should exclude rows with empty id', () => {
      const { result } = renderHook(() => usePublications())

      const csvData = `id,title,year,reference,authors,keywords,format
,Empty ID Pub,2020,Test Journal,Test Author,test,Scientific Paper
1,Valid Pub,2020,Test Journal,Test Author,test,Scientific Paper`

      const parsed = result.current.parseCSV(csvData)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe('1')
    })

    it('should exclude rows with #REF! id', () => {
      const { result } = renderHook(() => usePublications())

      const csvData = `id,title,year,reference,authors,keywords,format
#REF!,Bad Pub,2020,Test Journal,Test Author,test,Scientific Paper
1,Valid Pub,2020,Test Journal,Test Author,test,Scientific Paper`

      const parsed = result.current.parseCSV(csvData)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe('1')
    })
  })

  describe('cleanYears', () => {
    it('should replace year "0" with "-"', () => {
      const { result } = renderHook(() => usePublications())

      const pubs = [
        { id: '1', title: 'Pub', year: '0', authors: 'Author', keywords: 'test', reference: 'Ref', format: 'Paper' },
        { id: '2', title: 'Pub2', year: '2020', authors: 'Author', keywords: 'test', reference: 'Ref', format: 'Paper' },
      ]

      const cleaned = result.current.cleanYears(pubs)
      expect(cleaned[0].year).toBe('-')
      expect(cleaned[1].year).toBe('2020')
    })
  })

  describe('checkValidRow', () => {
    it('should return false for empty id', () => {
      const { result } = renderHook(() => usePublications())
      expect(result.current.checkValidRow({ id: '' })).toBe(false)
    })

    it('should return false for #REF! id', () => {
      const { result } = renderHook(() => usePublications())
      expect(result.current.checkValidRow({ id: '#REF!' })).toBe(false)
    })

    it('should return true for valid id', () => {
      const { result } = renderHook(() => usePublications())
      expect(result.current.checkValidRow({ id: '1' })).toBe(true)
    })
  })
})
