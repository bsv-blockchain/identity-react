import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { DisplayableIdentity } from "@bsv/sdk"
import type { AutocompleteInputChangeReason } from '@mui/material/Autocomplete'
import { fetchIdentities } from "../utils/identityUtils"

interface UseIdentitySearchProps {
  onIdentitySelected?: (selectedIdentity: DisplayableIdentity) => void
}

// Enhanced cache with cleanup
class SearchCache {
  private cache = new Map<string, { data: DisplayableIdentity[], timestamp: number }>()
  private readonly EXPIRY = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ENTRIES = 100 // Prevent memory leaks

  get(key: string): DisplayableIdentity[] | null {
    const normalizedKey = key.toLowerCase().trim()
    const entry = this.cache.get(normalizedKey)
    if (!entry) return null

    if (Date.now() - entry.timestamp > this.EXPIRY) {
      this.cache.delete(normalizedKey)
      return null
    }

    return entry.data
  }

  set(key: string, data: DisplayableIdentity[]): void {
    const normalizedKey = key.toLowerCase().trim()

    // Simple LRU: remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_ENTRIES) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    this.cache.set(normalizedKey, { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}

const searchCache = new SearchCache()

/**
 * Custom hook for identity search with debouncing, caching, and race condition prevention.
 * 
 * **Features:**
 * - Internal cache (SearchCache) with 5-minute expiry and LRU eviction
 * - Debounces search requests by 300ms to prevent excessive API calls
 * - Uses request ID system to prevent race conditions from out-of-order responses
 * 
 * **Performance:**
 * - Instant results for cached queries (0ms response time)
 * - Loading state only shows for non-cached searches
 * - Normalizes cache keys (lowercase, trimmed) for better hit rates
 * - Prevents memory leaks with max 100 cache entries
 * 
 * @param onIdentitySelected - Callback fired when user selects an identity
 * @returns Object with input handlers, state, and cache control
 */
export const useIdentitySearch = ({
  onIdentitySelected,
}: UseIdentitySearchProps = {}) => {
  const [inputValue, setInputValue] = useState("")
  const [selectedIdentity, setSelectedIdentity] = useState<DisplayableIdentity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [identities, setIdentities] = useState<DisplayableIdentity[]>([])
  const [lastSearchTerm, setLastSearchTerm] = useState("")

  // Refs for managing async operations
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRequestIdRef = useRef<number>(0)
  const justSelectedRef = useRef<boolean>(false) // Prevent search after selection
  const shouldClearResultsRef = useRef<boolean>(false) // Track explicit clear actions (X button)

  // Direct search function with improved error handling and state management
  const performSearch = useCallback(async (query: string, requestId: number) => {
    // Check cache first
    const cachedResult = searchCache.get(query)
    if (cachedResult && requestId === lastRequestIdRef.current) {
      setIdentities(cachedResult)
      setLastSearchTerm(query)
      setIsLoading(false)
      return
    }

    try {
      // Only proceed if this is still the latest request
      if (requestId !== lastRequestIdRef.current) {
        return
      }

      setIsLoading(true)

      const searchResults = await fetchIdentities(query)

      // Verify this is still the latest request before updating state (prevents race conditions)
      if (requestId === lastRequestIdRef.current) {
        setIdentities(searchResults)
        searchCache.set(query, searchResults)
        setLastSearchTerm(query)
        setIsLoading(false)
      }
    } catch (error: unknown) {
      // Only handle error if this is still the latest request
      if (requestId === lastRequestIdRef.current) {
        setIdentities([])
        setIsLoading(false)
      }
    }
  }, [])

  // Debounced search effect with instant cache lookup
  useEffect(() => {
    // Skip search if we just selected an option
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Handle empty input - only clear results on explicit clear (X button clicked)
    if (!inputValue.trim()) {
      setIsLoading(false)
      if (shouldClearResultsRef.current) {
        setIdentities([])
        setLastSearchTerm("")
        shouldClearResultsRef.current = false
      }
      return
    }

    // Check cache immediately for instant feedback
    const cachedResult = searchCache.get(inputValue.trim())
    if (cachedResult) {
      setIdentities(cachedResult)
      setLastSearchTerm(inputValue.trim())
      setIsLoading(false)
      return
    }

    // Clear existing results if searching for something different
    // Avoids showing stale results while new search loads
    const currentQuery = inputValue.trim()
    if (identities.length > 0 && lastSearchTerm !== currentQuery) {
      setIdentities([])
    }

    // Increment request ID for race condition prevention
    const requestId = ++lastRequestIdRef.current

    // Show loading state immediately for non-cached searches
    setIsLoading(true)

    // Debounce the search - wait 300ms after user stops typing
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(inputValue.trim(), requestId)
    }, 300)

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [inputValue, performSearch])


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleInputChange = useCallback((
    _: React.SyntheticEvent,
    newInputValue: string,
    reason: AutocompleteInputChangeReason
  ) => {
    // Mark for clearing only on explicit clear button (X) or manual delete to empty
    if (reason === 'clear' || (reason === 'input' && inputValue.trim() && !newInputValue.trim())) {
      shouldClearResultsRef.current = true
    }

    setInputValue(newInputValue)
  }, [inputValue])

  const handleSelect = useCallback((_: React.SyntheticEvent, newValue: DisplayableIdentity | string | null) => {
    if (newValue && typeof newValue !== 'string') {
      // Mark that we just selected to prevent triggering search on the next useEffect
      justSelectedRef.current = true

      // Clear search state after selection
      setIdentities([])
      setLastSearchTerm("")
      setSelectedIdentity(newValue)
      onIdentitySelected?.(newValue)
    } else {
      setSelectedIdentity(null)
    }
  }, [onIdentitySelected])

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    inputValue,
    isLoading,
    identities,
    selectedIdentity,
    handleInputChange,
    handleSelect,
    clearCache: searchCache.clear.bind(searchCache),
  }), [inputValue, isLoading, identities, selectedIdentity, handleInputChange, handleSelect])
}
