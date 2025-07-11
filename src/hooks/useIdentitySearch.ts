import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useStore } from "../utils/store"
import { DisplayableIdentity } from "@bsv/sdk"

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
 * **Store Dependencies:**
 * - Requires `useStore` with `fetchIdentities(query: string, setIsLoading: Function)` method
 * - Store should update its `identities` state after successful fetch
 * 
 * **Side Effects:**
 * - Manages internal cache (SearchCache) with 5-minute expiry and LRU eviction
 * - Debounces search requests by 300ms to prevent excessive API calls
 * - Uses request ID system to prevent race conditions from out-of-order responses
 * 
 * **Behavior:**
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

  // Refs for managing async operations
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRequestIdRef = useRef<number>(0)
  const justSelectedRef = useRef<boolean>(false) // Track if we just selected an option
  const { fetchIdentities } = useStore()

  // Optimized fetch function with enhanced caching and cancellation
  const performSearch = useCallback(async (query: string, requestId: number) => {
    // Check cache first
    const cachedResult = searchCache.get(query)
    if (cachedResult && requestId === lastRequestIdRef.current) {
      setIdentities(cachedResult)
      setIsLoading(false)
      return
    }

    try {
      // Only proceed if this is still the latest request
      if (requestId !== lastRequestIdRef.current) return

      setIsLoading(true)

      // Use the existing fetchIdentities with a custom setter
      await fetchIdentities(query, () => { }) // We manage loading state ourselves

      // Get the results from the store
      const searchResults = useStore.getState().identities

      // Only update if this is still the latest request
      if (requestId === lastRequestIdRef.current) {
        setIdentities(searchResults)
        searchCache.set(query, searchResults)
        setIsLoading(false)
      }
    } catch (error: unknown) {
      // Only handle error if this is still the latest request
      if (requestId === lastRequestIdRef.current) {
        console.error('Identity search error:', error)
        setIsLoading(false)
      }
    }
  }, [fetchIdentities])

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

    // Clear results and loading state if input is empty
    if (!inputValue.trim()) {
      setIsLoading(false)
      setIdentities([])
      return
    }

    // Check cache immediately for instant feedback
    const cachedResult = searchCache.get(inputValue.trim())
    if (cachedResult) {
      setIdentities(cachedResult)
      setIsLoading(false)
      return
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
    newInputValue: string
  ) => {
    setInputValue(newInputValue)
  }, [])

  const handleSelect = useCallback((_: React.SyntheticEvent, newValue: DisplayableIdentity | string | null) => {
    if (newValue && typeof newValue !== 'string') {
      // Mark that we just selected an option to prevent unnecessary search
      justSelectedRef.current = true
      setSelectedIdentity(newValue)
      onIdentitySelected?.(newValue)
    } else {
      setSelectedIdentity(null)
    }
  }, [onIdentitySelected])

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    inputValue,
    handleInputChange,
    selectedIdentity,
    handleSelect,
    identities,
    loading: isLoading,
    // Expose cache control for advanced use cases
    clearCache: () => searchCache.clear()
  }), [inputValue, handleInputChange, selectedIdentity, handleSelect, identities, isLoading])
}
