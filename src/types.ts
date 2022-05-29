import { BytesLike } from '@ethersproject/bytes'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { Provider } from '@ethersproject/providers'
import { Molotrader } from '../abis/types/Exchange'

export type SignerOrProvider = Signer | Provider

type Asset = {
  tokenId: BigNumberish
  collection: string
  schema: string // ERC721 or ERC1155
}

export enum TradeType {
  BID,
  ASK
}

export type OrderParams = {
  asset: Asset
  listingPrice: BigNumberish
  tradeType?: TradeType
  reservedAddress?: string
  refererrFeeBasis?: BigNumberish
  exchangeFeeBasis?: BigNumberish
  royaltyFeeBasis?: BigNumberish
  royaltyAddress?: string
  quantity?: BigNumberish
  traitRoot?: BytesLike
  deadline?: BigNumberish
}

export type FillOrderParams = {
  order: Molotrader.OrderStruct
  tradeType?: TradeType
  quantity?: BigNumberish
  refererrAddress?: string
  postPayment?: Molotrader.PaymentStruct
}

export type FillCriteriaBidParams = {
  order: Molotrader.OrderStruct
  tokenId: BigNumberish
  traitRoot?: string
  quantity?: BigNumberish
  refererrAddress?: string
  postPayment?: Molotrader.PaymentStruct
}

export interface ECSignature {
  v: BigNumberish
  r: BytesLike
  s: BytesLike
}

export enum SupportedChainId {
  MAINNET = 1
}
