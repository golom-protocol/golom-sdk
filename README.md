![Golom Logo](https://golom.io/_nuxt/img/logo.910e63a.svg)
# @golom/sdk
![MIT License](https://badgen.net/badge/license/MIT/blue) ![minified gzipped size](https://badgen.net/bundlephobia/minzip/@golom/sdk@0.1.5/)

This sdk contains collection of functions to interact with golom's smart contract.

## Table of Contents

* [___Installation___](#Installation)
* [___Usage___](#Usage)
     * [___Exchange___](#Exchange)
        * [___createOrder___](#1-createOrder)
        * [___fillOrder___](#2-fillOrder)
        * [___fillCriteriaBid___](#3-fillCriteriaBid)
        * [___cancelOrder___](#4-cancelOrder)
    * [___Emitter___](#Emitter)
    * [___Signing with custom provider___](#Signing-with-custom-provider)
* [___Types___](#Types)
    * [___SignedOrder___](#SignedOrder)


## Installation
Install with
```bash
yarn add @golom/sdk
```
or
```bash
npm install @golom/sdk
```

## Usage
### Exchange
#### 1. `createOrder()`

| param | type | 
| -------- | -------- 
| order     | [OrderParams](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts#L20) 
| accountAddress     | String
| provider     | [JsonRpcProvider](https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L354) 


```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { createOrder } from '@golom/sdk';

const provider = new Web3Provider(YOUR_WEB3_PROVIDER);

// returns SignedOrder
let order = await createOrder(
    {
        asset: {
        tokenId: 1,
        collection: SOME_COLLECTION_ADDRESS,
        schema: "ERC721" // "ERC721" or "ERC1155"
        },
        listingPrice: parseEther("1")
    },
    accountAddress,
    provider
)
```
#### 2. `fillOrder()`
| param | type | default | required
| -------- | -------- | -------- | --------
| orderParams     | [FillOrderParams](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts#L34) ||true
| accountAddress     | String || true
| provider     | [JsonRpcProvider](https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L354) || true
| overrides     | [Overrides](https://github.com/ethers-io/ethers.js/blob/master/packages/contracts/src.ts/index.ts#L17) | `{}` | false

```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { fillOrder } from '@golom/sdk';

const provider = new Web3Provider(YOUR_WEB3_PROVIDER);
const signer = provider.getSigner(SIGNER_ADDRESS);

// returns TransactionResponse
await fillOrder(
    signedOrder, // returned from createOrder() function
    accountAddress,
    provider
)
```

#### 3. `fillCriteriaBid()`
| param | type | default | required
| -------- | -------- | -------- | --------
| orderParams     | [FillCriteriaBidParams](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts#L42) ||true
| accountAddress     | String || true
| provider     | [JsonRpcProvider](https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L354) || true
| overrides     | [Overrides](https://github.com/ethers-io/ethers.js/blob/master/packages/contracts/src.ts/index.ts#L17) | `{}` | false


```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { fillCriteriaBid } from '@golom/sdk';

const provider = new Web3Provider(YOUR_WEB3_PROVIDER);
const signer = provider.getSigner(SIGNER_ADDRESS);

// returns TransactionResponse
await fillCriteriaBid(
    {
        order: signedOrder, // returned from createOrder() function
        tokenId: 1
    }, 
    accountAddress,
    provider
)
```

#### 4. `cancelOrder()`
| param | type | default | required
| -------- | -------- | -------- | --------
| order     | [SignedOrder](#SignedOrder) ||true
| accountAddress     | String || true
| provider     | [JsonRpcProvider](https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L354) || true
| overrides     | [Overrides](https://github.com/ethers-io/ethers.js/blob/master/packages/contracts/src.ts/index.ts#L17) | `{}` | false


```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { cancelOrder } from '@golom/sdk';

const provider = new Web3Provider(YOUR_WEB3_PROVIDER);
const signer = provider.getSigner(SIGNER_ADDRESS);

// returns TransactionResponse
await cancelOrder(
    signedOrder, // returned from createOrder() function
    accountAddress,
    provider
)
```
<a name="usage-emitter"></a>
### Emitter
Emits signed order to polygon blockchain.
> ⚠️ NOTE: use polygon mainnet provider in signer
#### `emitOrder()`
| param | type | default | required
| -------- | -------- | -------- | --------
| order     | [SignedOrder](#SignedOrder) ||true
| accountAddress     | String || true
| provider     | [JsonRpcProvider](https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L354) || true
| overrides     | [Overrides](https://github.com/ethers-io/ethers.js/blob/master/packages/contracts/src.ts/index.ts#L17) | `{}` | false

```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { emitOrder } from '@golom/sdk';

const provider = new Web3Provider(YOUR_POLYGON_PROVIDER);
const signer = provider.getSigner(SIGNER_ADDRESS);

// returns TransactionResponse
await emitOrder(
    signedOrder, // returned from createOrder() function
    accountAddress,
    provider
)
```
### Signing with custom provider

```typescript
import { Web3Provider } from '@ethersproject/providers';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { parseEther } from '@ethersproject/units';
import { createOrder } from '@golom/sdk';

import 'dotenv/config';

const hdWalletProvider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY!],
  providerOrUrl: process.env.RPC_URL
});

const provider = new Web3Provider(hdWalletProvider);

async function createMyOrder() {
    const accountAddress = hdWalletProvider.getAddress();
    
    const signedOrder = await createOrder( {
        asset: {
        tokenId: 1,
        collection: SOME_COLLECTION_ADDRESS,
        schema: "ERC721" // "ERC721" or "ERC1155"
        },
        listingPrice: parseEther("1")
    }, accountAddress, provider);
    
    return signedOrder;
}
```
> NOTE: we've used `2.0.10-alpha.2` version for `@truffle/hdwallet-provider`

## Types
For more details on type: [visit here](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts)
### SignedOrder
```typescript
// Molotrader.OrderStruct
type SignedOrder = {
    collection: string;
    tokenId: BigNumberish;
    signer: string;
    orderType: BigNumberish;
    totalAmt: BigNumberish;
    exchange: Molotrader.PaymentStruct;
    prePayment: Molotrader.PaymentStruct;
    isERC721: boolean;
    tokenAmt: BigNumberish;
    refererrAmt: BigNumberish;
    root: BytesLike;
    reservedAddress: string;
    nonce: BigNumberish;
    deadline: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  };
```

This version of `@golom/sdk` is still in beta, so unfortunately documentation is pretty sparse at the moment. Comments and the source code itself are the best ways to get an idea of what's going on. More thorough documentation is a priority as development continues!