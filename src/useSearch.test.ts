import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import type { Publication } from './types';

describe('useSearch', () => {
  const mockPublications: Publication[] = [
    {
      id: '1',
      title: 'Guide to Birds',
      authors: 'Chammings, A.',
      year: '1975',
      keywords: 'Birds, Habitat',
      reference: '',
      format: '',
    },
    {
      id: '2',
      title: 'Marine Life',
      authors: 'Furse, J.R.',
      year: '1980',
      keywords: 'Ocean',
      reference: '',
      format: '',
    },
    {
      id: '3',
      title: 'Birds of the Islands',
      authors: 'Furse, J.R.',
      year: '1975',
      keywords: 'Birds, Conservation',
      reference: '',
      format: '',
    },
  ];

  describe('search', () => {
    it('should set results to an array of publications that match the searchTerm', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('Chammings');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results.length).toBe(1);
      expect(result.current.results[0].id).toBe('1');

      act(() => {
        result.current.setSearchTerm('"Furse, J.R."');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results.length).toBe(2);

      act(() => {
        result.current.setSearchTerm('"Furse, J.R." 1975');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results.length).toBe(1);
      expect(result.current.results[0].id).toBe('3');

      act(() => {
        result.current.setSearchTerm('Birds');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results.length).toBe(2);
    });

    it('should set results to an empty array if searchTerm is empty', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('   ');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      expect(result.current.results).toEqual([]);
    });

    it('should set results to empty when searching with no matches', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('bannanas');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('minimum search length', () => {
    it('should not return results when search term has fewer than 3 characters', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('Ch');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results).toEqual([]);
    });

    it('should return results when search term has 3 or more characters', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('Cha');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results.length).toBe(1);
      expect(result.current.results[0].id).toBe('1');
    });

    it('should return empty results for short search terms even if they match', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('B');
      });
      act(() => {
        result.current.search(mockPublications);
      });
      expect(result.current.results).toEqual([]);
    });
  });

  describe('clearSearch', () => {
    it('should clear search term and results', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('test');
        result.current.search(mockPublications);
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.results).toEqual([]);
    });
  });

  describe('search tracking (Matomo site search)', () => {
    let mockPushState: ReturnType<typeof vi.fn>;
    let mockSetSearchParams: ReturnType<typeof vi.fn>;
    let mockDeleteSearchParams: ReturnType<typeof vi.fn>;
    let mockSearchParams: any;
    let mockUrl: any;
    const testHref = 'http://localhost:3000/';

    beforeEach(() => {
      vi.useFakeTimers();
      mockPushState = vi.fn();
      mockSetSearchParams = vi.fn();
      mockDeleteSearchParams = vi.fn();
      mockSearchParams = {
        delete: mockDeleteSearchParams,
        set: mockSetSearchParams,
      };
      mockUrl = {
        searchParams: mockSearchParams,
        pathname: '/',
        href: testHref,
      };

      global.URL = vi.fn(() => mockUrl) as any;
      global.history = {
        ...global.history,
        pushState: mockPushState,
      } as any;
      (global as any).window._paq = [];
      // Mock window.location to match our test expectation
      Object.defineProperty(global.window, 'location', {
        value: { href: testHref, pathname: '/', search: '' },
        writable: true,
      });
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('should update URL with search query parameter after debounce delay', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('falklands');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Should not have tracked yet (before delay)
      expect(global.history.pushState).not.toHaveBeenCalled();

      // Advance timer by 1999ms — still not enough
      act(() => {
        vi.advanceTimersByTime(1999);
      });
      expect(global.history.pushState).not.toHaveBeenCalled();

      // Advance timer by 1ms more — total 2000ms, should track now
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(global.URL).toHaveBeenCalledWith(testHref);
      expect(mockSearchParams.set).toHaveBeenCalledWith('q', 'falklands');
      expect(global.history.pushState).toHaveBeenCalled();
    });

    it('should reset debounce timer on each new search term', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('falklands');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Advance 1000ms — not enough
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(global.history.pushState).not.toHaveBeenCalled();

      // User types another character — timer resets
      act(() => {
        result.current.setSearchTerm('falklands ');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Advance 1000ms more — still not enough (new timer started)
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(global.history.pushState).not.toHaveBeenCalled();

      // Advance 1000ms more — now should track
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(global.history.pushState).toHaveBeenCalled();
      // searchTerm.trim() is called in the tracking code, so trailing space is removed
      expect(mockSearchParams.set).toHaveBeenCalledWith('q', 'falklands');
    });

    it('should not track search terms shorter than 3 characters', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('ab');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Advance past debounce delay
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(global.history.pushState).not.toHaveBeenCalled();
    });

    it('should clear debounce timer on clearSearch', () => {
      const { result } = renderHook(() => useSearch());

      // Track how many times pushState is called
      const callCountBeforeClear = () => mockPushState.mock.calls.length;

      act(() => {
        result.current.setSearchTerm('falklands');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Clear search before debounce completes
      act(() => {
        result.current.clearSearch();
      });

      const callCountAfterClear = callCountBeforeClear();

      // Advance past debounce delay
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // pushState should not be called again after clearSearch
      expect(mockPushState.mock.calls.length).toBe(callCountAfterClear);
    });

    it('should clear the URL to root on clearSearch', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setSearchTerm('falklands');
      });
      act(() => {
        result.current.search(mockPublications);
      });

      // Advance past debounce delay to set the parameter
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Clear the search
      act(() => {
        result.current.clearSearch();
      });

      expect(global.history.pushState).toHaveBeenCalledWith({}, '', '/');
    });
  });
});
