import { isAddress } from '@ethersproject/address'
import { JsonRpcProvider } from '@ethersproject/providers'
import { toBuffer, bufferToHex, fromRpcSig } from 'ethereumjs-util'
import { GOLOM_EXCHANGE } from '../../constants'
import { ECSignature, SupportedChainId } from '../../types'
import { getCreateOrderTypedData } from './getCreateOrderTypedData'

/* eslint no-underscore-dangle: 0 */
async function parseSignatureHex(signature: string) {
  // HACK: There is no consensus on whether the signatureHex string should be formatted as
  // v + r + s OR r + s + v, and different clients (even different versions of the same client)
  // return the signature params in different orders. In order to support all client implementations,
  // we parse the signature in both ways, and evaluate if either one is a valid signature.
  const validVParamValues = [27, 28]

  function _parseSignatureHexAsVRS(signatureHex: string) {
    const signatureBuffer = toBuffer(signatureHex)
    let v = signatureBuffer[0]
    if (v < 27) {
      v += 27
    }
    const r = signatureBuffer.slice(1, 33)
    const s = signatureBuffer.slice(33, 65)
    const ecSignature = {
      v,
      r: bufferToHex(r),
      s: bufferToHex(s)
    }
    return ecSignature
  }

  function _parseSignatureHexAsRSV(signatureHex: string) {
    const { v, r, s } = fromRpcSig(signatureHex)
    const ecSignature = {
      v,
      r: bufferToHex(r),
      s: bufferToHex(s)
    }
    return ecSignature
  }

  const ecSignatureRSV = _parseSignatureHexAsRSV(signature)
  if (validVParamValues.includes(ecSignatureRSV.v)) {
    return ecSignatureRSV
  }

  // For older clients
  const ecSignatureVRS = _parseSignatureHexAsVRS(signature)
  if (validVParamValues.includes(ecSignatureVRS.v)) {
    return ecSignatureVRS
  }

  throw new Error('Invalid signature')
}

/**
 * Sign messages using web3 signTypedData signatures
 * @param provider Web3 provider
 * @param message message to sign
 * @param signerAddress web3 address signing the message
 * @returns A signature if provider can sign, otherwise null
 */
// eslint-disable-next-line import/prefer-default-export
export async function signTypedDataAsync(
  provider: JsonRpcProvider,
  message: any,
  signerAddress: string
): Promise<ECSignature> {
  if (!isAddress(signerAddress)) throw new Error(`Not a valid signerAddress: ${signerAddress}`)

  const callback = async (result: any) => {
    return parseSignatureHex(result)
  }

  const { domain, types, primaryType } = getCreateOrderTypedData(SupportedChainId.MAINNET, GOLOM_EXCHANGE)
  const stringified = JSON.stringify({ message, domain, primaryType, types })

  try {
    // Using sign typed data V4 works with a stringified message, used by browser providers i.e. Metamask
    return await provider.send('eth_signTypedData_v4', [signerAddress, stringified]).then(callback)
  } catch (error) {
    console.log(error)
    // Fallback to normal sign typed data for node providers, without using stringified message
    // https://github.com/coinbase/coinbase-wallet-sdk/issues/60
    return provider.send('eth_signTypedData', [signerAddress, { message, domain, primaryType, types }]).then(callback)
  }
}
