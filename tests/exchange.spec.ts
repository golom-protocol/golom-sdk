/* eslint-disable no-undef */
import { parseEther } from '@ethersproject/units'
import { Web3Provider } from '@ethersproject/providers'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { createOrder } from '../src'

import 'dotenv/config'

const hdWalletProvider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY!],
  providerOrUrl: process.env.RPC_URL
})

const provider = new Web3Provider(hdWalletProvider)

describe('#exchange', () => {
  it('createOrder', async () => {
    const accountAddress = hdWalletProvider.getAddress()
    const signedOrder = await createOrder(
      {
        asset: {
          collection: '0x81ae0be3a8044772d04f32398bac1e1b4b215aa8', // dreadfulz
          tokenId: '1',
          schema: 'ERC721'
        },
        listingPrice: parseEther('0.0001')
      },
      accountAddress,
      provider
    )
    console.log({ signedOrder })
  })
})
