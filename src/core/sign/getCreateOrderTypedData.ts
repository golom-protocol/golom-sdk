import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import { SupportedChainId } from '../../types'

const version = 1

/**
 * Get LR typed data for creating maker orders.
 * Use with a signTypedData function.
 * @see https://eips.ethereum.org/EIPS/eip-712
 * @param chainId Current chain id
 * @param verifyingContract Exchange contract address
 * @returns { type: Record<string, TypedDataField[]>, domain: TypedDataDomain }
 */
// eslint-disable-next-line import/prefer-default-export
export const getCreateOrderTypedData = (
  chainId: SupportedChainId,
  verifyingContract: string
): {
  types: Record<string, TypedDataField[]>
  domain: TypedDataDomain
  primaryType: string
} => {
  const domain: TypedDataDomain = {
    name: 'GOLOM.IO',
    version: version.toString(),
    chainId,
    verifyingContract
  }

  const types: Record<string, Array<TypedDataField>> = {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    payment: [
      { name: 'paymentAmt', type: 'uint256' },
      { name: 'paymentAddress', type: 'address' }
    ],
    order: [
      { name: 'collection', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'signer', type: 'address' },
      { name: 'orderType', type: 'uint256' },
      { name: 'totalAmt', type: 'uint256' },
      { name: 'exchange', type: 'payment' },
      { name: 'prePayment', type: 'payment' },
      { name: 'isERC721', type: 'bool' },
      { name: 'tokenAmt', type: 'uint256' },
      { name: 'refererrAmt', type: 'uint256' },
      { name: 'root', type: 'bytes32' },
      { name: 'reservedAddress', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  }

  const primaryType = 'order'

  return {
    types,
    domain,
    primaryType
  }
}
