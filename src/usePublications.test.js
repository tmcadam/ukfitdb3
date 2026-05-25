import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePublications } from './usePublications'

describe('usePublications', () => {

  describe('loadPublications', () => {
    it('should load from CSV synchronously', () => {
      const { result } = renderHook(() => usePublications())

      act(() => {
        result.current.loadPublications()
      })

      expect(result.current.publications.length).toBeGreaterThan(0)
      expect(result.current.loadingStatus).toBe(false)
    })
  })

  describe('reloadPublications', () => {
    it('should reload from CSV', () => {
      const { result } = renderHook(() => usePublications())
      act(() => {
        result.current.reloadPublications()
      })
      expect(result.current.publications.length).toBeGreaterThan(0)
    })
  })

  describe('parseCSV', () => {
    it('should parse CSV data and return publications array', () => {
      const { result } = renderHook(() => usePublications())

      const csvData = `id,title,year,reference,authors,keywords,format
1,Test Publication,2020,Test Journal,Test Author,test keywords,Scientific Paper
2,Another Pub,2021,Another Journal,Another Author,another keyword,Report`

      const parsed = result.current.parseCSV(csvData)

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
      expect(result.current.checkValidRow({ id: '' })).toBeFalsy()
    })

    it('should return false for #REF! id', () => {
      const { result } = renderHook(() => usePublications())
      expect(result.current.checkValidRow({ id: '#REF!' })).toBeFalsy()
    })

    it('should return true for valid id', () => {
      const { result } = renderHook(() => usePublications())
      expect(result.current.checkValidRow({ id: '1' })).toBeTruthy()
    })
  })
})
