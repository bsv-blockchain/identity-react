# metanet-identity-react

Tools for resolving identity information on the MetaNet.

The code is hosted [on GitHub](https://github.com/p2ppsr/metanet-identity-react) and the package is available [through NPM](https://www.npmjs.com/package/metanet-identity-react).

## Installation

    npm i metanet-identity-react

## Example Usage

```ts
import React, { useState } from 'react'
import { IdentityResolver, Identity } from 'metanet-identity-react'

const IdentityDisplay: React.FC = () => {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)

  return (
    <div>
        <IdentityResolver onIdentitySelected={(identity) => {
            setSelectedIdentity(identity)
        }} />
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

## License

The license for the code in this repository is the Open BSV License.
