import { useState, useEffect } from "react" // Switched to useEffect as we're not using async directly in the effect
import { useStore } from "../utils/store"
import { DisplayableIdentity } from "@bsv/sdk"

interface UseIdentitySearchProps {
  onIdentitySelected?: (selectedIdentity: DisplayableIdentity) => void
}

export const useIdentitySearch = ({
  onIdentitySelected = () => { },
}: UseIdentitySearchProps = {}) => {
  const [inputValue, setInputValue] = useState("")
  const { identities, fetchIdentities } = useStore()
  const [selectedIdentity, setSelectedIdentity] = useState<DisplayableIdentity | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (inputValue) {
      fetchIdentities(inputValue, setIsLoading)
    }
  }, [inputValue, fetchIdentities])

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue)
  }

  const handleSelect = (_: React.SyntheticEvent, newValue: DisplayableIdentity | null) => {
    setSelectedIdentity(newValue)
    if (newValue) {
      onIdentitySelected(newValue)
    }
  }

  return {
    inputValue,
    setInputValue: handleInputChange,
    selectedIdentity,
    setSelectedIdentity: handleSelect,
    identities,
    isLoading,
    setIsLoading,
  }
}
