import { Overrides } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero, One, Zero } from '@ethersproject/constants'
import { JsonRpcProvider, JsonRpcSigner, TransactionResponse } from '@ethersproject/providers'

import { FillCriteriaBidParams, FillOrderParams, OrderParams, TradeType } from '../types'
import { Molotrader } from '../../abis/types/Exchange'

import { getExchangeContract, getErc721Contract, getErc1155Contract, getWethContract } from '../contracts'
import { DEFAULT_DEADLINE, EXCHANGE_FEE_ADDRESS, GOLOM_EXCHANGE, NULL_ROOT, WETH_CONTRACT } from '../constants'
import { signTypedDataAsync } from './sign'
import { computeFees, throwInvalidOrder } from '../utils'

/**
 *
 * @param {OrderParams} order Order params
 * @param signer Signer object to sign the transaction
 * @param offline Flag to generate signature offline; for nodes
 * @returns {Molotrader.OrderStruct} Signed Order
 */
export async function createOrder(
  {
    asset,
    tradeType = TradeType.ASK,
    listingPrice,
    refererrFeeBasis = Zero,
    exchangeFeeBasis = Zero,
    royaltyFeeBasis = Zero,
    royaltyAddress = AddressZero,
    quantity = One,
    traitRoot = NULL_ROOT,
    deadline = DEFAULT_DEADLINE
  }: OrderParams,
  signer: JsonRpcSigner
): Promise<Molotrader.OrderStruct | null> {
  const exchangeContract = getExchangeContract(GOLOM_EXCHANGE, signer.provider)
  const accountAddress = await signer.getAddress()
  const nonce = await exchangeContract.nonces(accountAddress)
  let orderType = 0

  if (tradeType === TradeType.BID) {
    if (asset.tokenId) orderType = 1
    else orderType = 2
  } else orderType = 0

  const order = {
    collection: asset.collection,
    tokenId: Number(asset.tokenId),
    signer: accountAddress,
    orderType,
    totalAmt: Number(listingPrice),
    exchange: {
      paymentAmt: Number(computeFees(BigNumber.from(exchangeFeeBasis), BigNumber.from(listingPrice))),
      paymentAddress: EXCHANGE_FEE_ADDRESS
    },
    prePayment: {
      paymentAmt: Number(computeFees(BigNumber.from(royaltyFeeBasis), BigNumber.from(listingPrice))),
      paymentAddress: royaltyAddress ?? EXCHANGE_FEE_ADDRESS
    },
    isERC721: asset.schema === 'ERC721',
    tokenAmt: Number(quantity) ?? Number(One),
    refererrAmt: Number(computeFees(BigNumber.from(refererrFeeBasis), BigNumber.from(listingPrice))),
    root: traitRoot,
    reservedAddress: AddressZero,
    nonce: Number(nonce),
    deadline: Number(deadline)
  }

  const ecSignature = await signTypedDataAsync(signer.provider, order, accountAddress)
  const signedOrder = { ...order, ...ecSignature }

  try {
    const orderResponse = await exchangeContract.validateOrder(signedOrder)
    if (orderResponse[0].toString() !== '3') {
      return throwInvalidOrder({
        orderHash: orderResponse[1],
        type: `InvalidOrder`,
        message: `Failed to validate sell order parameters. Make sure you're on the right network!`
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error as string)
  }

  return signedOrder
}

/**
 *
 * @param {Molotrader.OrderStruct} order Signed Order
 * @param signer Signer object to sign the transaction
 * @param overrides Additional transaction params
 * @returns {TransactionResponse} Transaction response
 */
export async function cancelOrder(
  order: Molotrader.OrderStruct,
  signer: JsonRpcSigner,
  overrides: Overrides = {}
): Promise<TransactionResponse> {
  const exchangeContract = getExchangeContract(GOLOM_EXCHANGE, signer)
  return exchangeContract.cancelOrder(order, overrides)
}

async function validateBidOrder({
  order,
  provider,
  orderHash
}: {
  order: Molotrader.OrderStruct
  provider: JsonRpcProvider
  orderHash: string
}): Promise<Boolean> {
  // check WETH approval and balance of bidder
  const weth = getWethContract(WETH_CONTRACT, provider)
  const allowance = await weth.allowance(order.signer, GOLOM_EXCHANGE)
  const balance = await weth.balanceOf(order.signer)
  const orderAmount = BigNumber.from(order.totalAmt)

  if (orderAmount.gt(allowance)) {
    return throwInvalidOrder({
      orderHash,
      type: `InvalidOffer`,
      message: `Bidder has insufficent WETH allownace`
    })
  } else if (orderAmount.gt(balance)) {
    return throwInvalidOrder({
      orderHash,
      type: `InvalidOffer`,
      message: `Bidder has insufficent WETH balance`
    })
  }

  return true
}

async function validateAskOrder({
  order,
  provider,
  orderHash
}: {
  order: Molotrader.OrderStruct
  provider: JsonRpcProvider
  orderHash: string
}): Promise<Boolean> {
  let isOwned: boolean
  let allowance: boolean

  // check if the owner is seller(order.signer) in case of ERC721 and ERC1155
  if (order.isERC721) {
    const erc721 = getErc721Contract(order.collection, provider)
    // check token approval and balance of seller
    allowance = await erc721.isApprovedForAll(order.signer, GOLOM_EXCHANGE)
    const owner = await erc721.ownerOf(order.tokenId)
    isOwned = owner.toLowerCase() === order.signer.toLowerCase()
  } else {
    const erc1155 = getErc1155Contract(order.collection, provider)
    allowance = await erc1155.isApprovedForAll(order.signer, GOLOM_EXCHANGE)
    const qtyBalance = await erc1155.balanceOf(order.signer, order.tokenId)
    if (BigNumber.from(order.tokenAmt).gt(qtyBalance)) {
      // quantity is less than order quantity
      isOwned = false
    } else {
      isOwned = true
    }
  }

  if (!allowance)
    return throwInvalidOrder({
      orderHash,
      type: `InvalidOrder`,
      message: `Seller has not approved token(s) yet`
    })
  else if (!isOwned)
    return throwInvalidOrder({
      orderHash,
      type: `InvalidOrder`,
      message: `Seller does not own NFT(s) anymore`
    })

  return true
}

/**
 *
 * @param {FillOrderParams} params FillOrder params
 * @param signer Signer object to sign the transaction
 * @param overrides Additional transaction params
 * @returns {TransactionResponse} Transaction response
 */
export async function fillOrder(
  {
    order,
    tradeType = TradeType.ASK,
    quantity = One,
    refererrAddress = AddressZero,
    postPayment = {
      paymentAmt: Zero,
      paymentAddress: AddressZero
    }
  }: FillOrderParams,
  signer: JsonRpcSigner,
  overrides: Overrides = {}
): Promise<TransactionResponse | undefined> {
  const exchangeContract = getExchangeContract(GOLOM_EXCHANGE, signer)
  const accountAddress = await signer.getAddress()
  let orderResponse

  try {
    orderResponse = await exchangeContract.validateOrder(order)
  } catch (error) {
    throw new Error(error as string)
  }

  if (tradeType === TradeType.BID) {
    const isValidBid = await validateBidOrder({
      order,
      provider: signer.provider,
      orderHash: orderResponse[1]
    })

    if (isValidBid) {
      return exchangeContract.fillBid(order, quantity, refererrAddress, postPayment, {
        ...overrides,
        from: accountAddress
      })
    }
  } else {
    const isValidAsk = await validateAskOrder({
      order,
      provider: signer.provider,
      orderHash: orderResponse[1]
    })

    if (isValidAsk) {
      return exchangeContract.fillAsk(order, quantity, refererrAddress, postPayment, {
        ...overrides,
        from: accountAddress,
        value: BigNumber.from(order.totalAmt)
      })
    }
  }
  return undefined
}

/**
 *
 * @param {FillCriteriaBidParams} params FillCriteriaBid params
 * @param signer Signer object to sign the transaction
 * @param overrides Additional transaction params
 * @returns {TransactionResponse} Transaction response
 */
export async function fillCriteriaBid(
  {
    order,
    tokenId,
    traitRoot = NULL_ROOT,
    quantity = One,
    refererrAddress = AddressZero,
    postPayment = {
      paymentAmt: Zero,
      paymentAddress: AddressZero
    }
  }: FillCriteriaBidParams,
  signer: JsonRpcSigner,
  overrides: Overrides = {}
): Promise<TransactionResponse | undefined> {
  const exchangeContract = getExchangeContract(GOLOM_EXCHANGE, signer)
  const accountAddress = await signer.getAddress()
  let orderResponse

  try {
    orderResponse = await exchangeContract.validateOrder(order)
    if (!orderResponse[0].eq(3)) {
      return throwInvalidOrder({
        orderHash: orderResponse[1],
        type: `InvalidOrder`,
        message: `Failed to validate sell order parameters. Make sure you're on the right network!`
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error as string)
  }
  const isValidBid = await validateBidOrder({
    order,
    provider: signer.provider,
    orderHash: orderResponse[1]
  })

  if (isValidBid) {
    return exchangeContract.fillCriteriaBid(order, quantity, tokenId, [traitRoot], refererrAddress, postPayment, {
      ...overrides,
      from: accountAddress
    })
  }
  return undefined
}
