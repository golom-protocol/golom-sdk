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
| signer     | [JsonRpcSigner](https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L58) 


```typescript
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { createOrder } from '@golom/sdk';

const provider = new Web3Provider(YOUR_WEB3_PROVIDER);
const signer = provider.getSigner(SIGNER_ADDRESS);

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
    signer
)
```
#### 2. `fillOrder()`
| param | type | default | required
| -------- | -------- | -------- | --------
| orderParams     | [FillOrderParams](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts#L34) ||true
| signer     | [JsonRpcSigner](https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L58) || true
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
    signer
)
```

#### 3. `fillCriteriaBid()`
| param | type | default | required
| -------- | -------- | -------- | --------
| orderParams     | [FillCriteriaBidParams](https://github.com/golom-protocol/golom-sdk/blob/main/src/types.ts#L42) ||true
| signer     | [JsonRpcSigner](https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L58) || true
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
    signer
)
```

#### 4. `cancelOrder()`
| param | type | default | required
| -------- | -------- | -------- | --------
| order     | [SignedOrder](#SignedOrder) ||true
| signer     | [JsonRpcSigner](https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L58) || true
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
    signer
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
| signer     | [JsonRpcSigner](https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L58) || true
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
    signer
)
```
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