import { Zero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

// eslint-disable-next-line import/prefer-default-export
export function computeFees(basis: BigNumber, amount: BigNumber): BigNumber {
  if (!basis && !amount) return Zero
  return basis.mul(amount).div(10000)
}
