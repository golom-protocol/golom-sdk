/* eslint-disable no-undef */
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { createOrder, TradeType } from '../src'

import 'dotenv/config'

const provider = new JsonRpcProvider(
  process.env.RPC_URL || 'https://mainnet.infura.io/v3/c6d0254ae1bd4953ab2faf21e37b1282'
)
const wallet = (new Wallet(process.env.PRIVATE_KEY!, provider) as unknown) as JsonRpcSigner

describe('#exchange', () => {
  it('createOrder', async () => {
    await createOrder(
      {
        asset: {
          collection: '0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949',
          tokenId: '8762',
          schema: 'ERC721'
        },
        tradeType: TradeType.BID,
        listingPrice: 1
      },
      wallet
    )
  })
})
