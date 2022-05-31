export const GOLOM_EXCHANGE = '0xd29e1FcB07e55eaceB122C63F8E50441C6acEdc9'
export const NULL_ROOT = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const EXCHANGE_FEE_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const WETH_CONTRACT = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export const EIP_712_GOLOM_DOMAIN = {
  name: 'GOLOM.IO',
  version: '1',
  chainId: 1,
  verifyingContract: GOLOM_EXCHANGE
}

export const EIP_712_ORDER_TYPES = {
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

export const DEFAULT_DEADLINE = Math.floor(Date.now() / 1000 + 86400 * 7) // in 7 days
