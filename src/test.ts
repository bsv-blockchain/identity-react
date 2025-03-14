import { CertificateDefinitionData, DefinitionData, IdentityClient, RegistryClient, WalletClient } from "@bsv/sdk"

// (async () => {
//   const wallet = new WalletClient('json-api', 'non-admin.com')
//   const client = new IdentityClient(wallet)
//   const result = await client.resolveByIdentityKey({
//     identityKey: '0240c42181068275a4f996ee570ed7c7a97c30003b174461bca5bad882fc06143f'
//   })
//   const result2 = await client.resolveByAttributes({
//     attributes: {
//       cool: 'true'
//     }
//   })
//   console.log(result)
//   console.log(result2)
// })()


(async () => {
  const wallet = new WalletClient('json-api', 'non-admin.com')
  const client = new RegistryClient(wallet)

  // BasketMap Type Registration Test
  // const basketMapTestResult = await client.registerDefinition({ // add validation for non empty strings!
  //   definitionType: 'basket',
  //   basketID: 'certmap',
  //   name: 'Certificate Map Basket',
  //   iconURL: 'https://projectbabbage.com/favicon.ico',
  //   description: 'Maps certificate types to human readable information about their purpose.',
  //   documentationURL: 'https://coolcert.babbage.systems'
  // })
  // console.log(basketMapTestResult)

  // BasketMap Query Test
  // const basketMapQuery = await client.resolve(
  //   'basket',
  //   {
  //     basketID: 'certmap',
  //     registryOperators: ['0240c42181068275a4f996ee570ed7c7a97c30003b174461bca5bad882fc06143f']
  //   }
  // )
  // console.log(basketMapQuery)

  // const result = await client.listOwnRegistryEntries('certificate')
  // console.log(result)

  // ProtoMap test
  // const result3 = await client.registerDefinition({
  //   definitionType: 'protocol',
  //   protocolID: [1, 'identity'],
  //   name: 'Identity',
  //   iconURL: 'https://projectbabbage.com/favicon.ico',
  //   description: 'The identity protocol is used in the key derivation for identity token issuance.',
  //   documentationURL: 'https://coolcert.babbage.systems'
  // })
  // console.log(result3)
  // note errors return no hosts found...
  // const result = await client.resolve(
  //   'protocol',
  //   {
  //     protocolID: [1, 'identity'],
  //     registryOperators: ['0240c42181068275a4f996ee570ed7c7a97c30003b174461bca5bad882fc06143f']
  //   }
  // )
  // console.log(result)

  const result = await client.listOwnRegistryEntries('protocol')
  console.log(result)

  await client.revokeOwnRegistryEntry(result[0])

  // Certificate registration test -------------
  // const result = await client.registerDefinition({
  //   definitionType: 'certificate',
  //   type: 'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo=',
  //   name: 'CoolCert Certificate',
  //   iconURL: 'https://coolcert.babbage.systems/favicon.ico',
  //   description: 'idk',
  //   documentationURL: 'https://coolcert.babbage.systems',
  //   fields: {
  //     cool: {
  //       friendlyName: 'Cool',
  //       description: 'The definition of cool!',
  //       type: 'text',
  //       fieldIcon: 'https://coolcert.babbage.systems/favicon.ico'
  //     }
  //   }
  // })
  // console.log(result)

  // const result2 = await client.resolve(
  //   'certificate',
  //   {
  //     type: 'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo=',
  //     // name: 'CoolCert Certificate',
  //     registryOperators: ['0240c42181068275a4f996ee570ed7c7a97c30003b174461bca5bad882fc06143f']
  //   }
  // );
  // console.log((result2[0] as CertificateDefinitionData).fields)
  // console.log(result2)
})()