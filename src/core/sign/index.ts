import { splitSignature } from '@ethersproject/bytes'
import { JsonRpcSigner } from '@ethersproject/providers'
import { GOLOM_EXCHANGE } from '../../constants'
import { ECSignature, SupportedChainId } from '../../types'
import { getCreateOrderTypedData } from './getCreateOrderTypedData'

/**
 * Sign messages using web3 signTypedData signatures
 * @param signer Signer object to sign the message
 * @param message Message to sign
 * @returns signature
 */
// eslint-disable-next-line import/prefer-default-export
export async function signTypedDataAsync(signer: JsonRpcSigner, message: any): Promise<ECSignature> {
  const { domain, types } = getCreateOrderTypedData(SupportedChainId.MAINNET, GOLOM_EXCHANGE)

  // eslint-disable-next-line no-underscore-dangle
  const signature = await signer._signTypedData(domain, types, message)

  return splitSignature(signature)
}
