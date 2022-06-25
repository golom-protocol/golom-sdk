/* eslint-disable no-undef */
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { Wallet } from '@ethersproject/wallet'
import { emitOrder } from '../src'

import 'dotenv/config'

const provider = new JsonRpcProvider('https://polygon-rpc.com/')
const wallet = (new Wallet(process.env.EMITTER_ACC_PVT_KEY!, provider) as unknown) as JsonRpcSigner

describe('#emitter', () => {
  it('emitOrder', async () => {
    const tx = await emitOrder(
      {
        collection: '0xf8d4fef9af82de6e57f6aabafd49ff9730242d75',
        tokenId: '7863',
        signer: '0x7D37Ef98CfbDecc46fbB6545315d873509888a98',
        orderType: 0,
        totalAmt: '26000000000000000',
        exchange: {
          paymentAmt: '0',
          paymentAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
        },
        prePayment: {
          paymentAmt: '0',
          paymentAddress: '0xee5dc8527fc760b6edd2e8cd2910c9a4a5710e51'
        },
        isERC721: true,
        tokenAmt: 1,
        refererrAmt: '0',
        root: '0x0000000000000000000000000000000000000000000000000000000000000000',
        reservedAddress: '0x0000000000000000000000000000000000000000',
        nonce: 0,
        deadline: 1656352081,
        v: 27,
        r: '0x3e0de926cdfcdfe542cdfbe2b9b80a431d9013b6f0f1c937cd9af87999d01c12',
        s: '0x59061c57be08c48320eca6b31b883bbe5dd80210d7f415b7095aef9dba3f96c5'
      },
      wallet,
      { maxFeePerGas: parseUnits('200', 'gwei'), maxPriorityFeePerGas: parseUnits('200', 'gwei') }
    )

    console.log(tx)
  })
})
