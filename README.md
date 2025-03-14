# Identity React Components

A library of reusable React components for displaying and searching identity information on the BSV Blockchain.

## Installation

```bash
npm install @bsv/identity-react
```
## Example Usage

#### Identity Card

```ts
import React, { useState } from 'react'
import { IdentityCard } from '@bsv/identity-react'

const App = () => {
  return (
    {/* Display an identity card using a known identity key */}
    <IdentityCard 
      identityKey="0240c42181068275a4f996ee570ed7c7a97c30003b174461bca5bad882fc06143f" 
    />
  )
}
```

#### Identity Search Field

```ts
import React, { useState } from 'react'
import { IdentitySearchField, Identity } from '@bsv/identity-react'

const IdentityDisplay: React.FC = () => {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)

  return (
    {/* Add a search field */}
    <div>
         <IdentitySearchField onIdentitySelected={(identity) => {
            setSelectedIdentity(identity)
          }}/>
        {selectedIdentity && (
            <div>
                <h2>Selected Identity</h2>
                <p>Name: {selectedIdentity.name}</p>
                <p>Identity Key: {selectedIdentity.identityKey}</p>
            </div>
        )}
    </div>
  )
}
```

## Example Headless Usage (useIdentitySearch Hook)

```ts
import { useIdentitySearch } from "@bsv/identity-react"

const App = () => {
  
  const {
    identities,
    isLoading,
    setIsLoading,
    inputValue,
    setInputValue,
    selectedIdentity,
    setSelectedIdentity,
  } = useIdentitySearch()

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          onChange={(e) => {
            setInputValue(e, e.target.value)
          }}
        />
        {isLoading ? (
          <p>Loading identities...</p>
        ) : (
          <>
            {inputValue !== "" && (
              <>
                {identities.map((identity, index) => {
                  return (
                    <button key={index}
                      onClick={(e) => {
                        setSelectedIdentity(e, identity)
                      }}
                    >
                      {identity.name}
                    </button>
                  )
                })}
              </>
            )}
          </>
        )}
        {selectedIdentity && (
          <>
            <h1>Selected Identity:</h1>
            <p>{selectedIdentity.name}</p>
            <img src={selectedIdentity.profilePhoto} width={64} />
            <p style={{ wordWrap: "break-word" }}>
              Identity Key: {selectedIdentity.identityKey}
            </p>
          </>
        )}
      </div>
    </>
  )
}

export default App
```

## License

The license for the code in this repository is the Open BSV License.
