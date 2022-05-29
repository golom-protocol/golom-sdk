import { getAddress } from '@ethersproject/address'
import { Weth } from '../../abis/types/tokens/Weth'
import { Erc721 } from '../../abis/types/tokens/Erc721'
import { Erc1155 } from '../../abis/types/tokens/Erc1155'
import {
  Exchange__factory as ExchangeFactory,
  Erc721__factory as ERC721Factory,
  Erc1155__factory as ERC1155Factory,
  Weth__factory as WETHFactory,
  Exchange
} from '../../abis/types'

import { SignerOrProvider } from '../types'

/**
 *
 * @param address Address of exchange
 * @param signerOrProvider Instance of JsonRpcProvider or JsonRpcSigner
 * @returns {Exchange} Exchange Contract
 */
function getExchangeContract(address: string, signerOrProvider: SignerOrProvider): Exchange {
  getAddress(address)
  return ExchangeFactory.connect(address, signerOrProvider)
}

/**
 *
 * @param address Address of exchange
 * @param signerOrProvider Instance of JsonRpcProvider or JsonRpcSigner
 * @returns {Erc721} ERC721 Contract
 */
function getErc721Contract(address: string, signerOrProvider: SignerOrProvider): Erc721 {
  getAddress(address)
  return ERC721Factory.connect(address, signerOrProvider)
}

/**
 *
 * @param address Address of exchange
 * @param signerOrProvider Instance of JsonRpcProvider or JsonRpcSigner
 * @returns {Erc1155} ERC1155 Contract
 */
function getErc1155Contract(address: string, signerOrProvider: SignerOrProvider): Erc1155 {
  getAddress(address)
  return ERC1155Factory.connect(address, signerOrProvider)
}

/**
 *
 * @param address Address of exchange
 * @param signerOrProvider Instance of JsonRpcProvider or JsonRpcSigner
 * @returns {Weth} WETH Contract
 */
function getWethContract(address: string, signerOrProvider: SignerOrProvider): Weth {
  getAddress(address)
  return WETHFactory.connect(address, signerOrProvider)
}

export { getExchangeContract, getErc721Contract, getErc1155Contract, getWethContract }
