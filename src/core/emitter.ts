import { Overrides } from '@ethersproject/contracts'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'

import { getEmitterContract } from '../contracts'
import { Molotrader } from '../../abis/types/Exchange'
import { EMITTER } from '../constants'

/**
 *
 * @param {Molotrader.OrderStruct} order Signed Order
 * @param accountAddress transaction callee
 * @param provider Provider
 * @param overrides Additional transaction params
 * @returns {TransactionResponse} Transaction response
 */
// eslint-disable-next-line import/prefer-default-export
export async function emitOrder(
  order: Molotrader.OrderStruct,
  accountAddress: string,
  provider: JsonRpcProvider,
  overrides: Overrides = {}
): Promise<TransactionResponse> {
  const signer = provider.getSigner(accountAddress)
  const emitterContract = getEmitterContract(EMITTER, signer)
  return emitterContract.pushOrder(order, overrides).catch(() => {
    throw new Error('Make sure you are passing POLYGON RPC signer')
  })
}
