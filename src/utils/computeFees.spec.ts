/* eslint-disable no-undef */
import { BigNumber } from '@ethersproject/bignumber'
import { computeFees } from './index'

describe('#computeFees', () => {
  it('calculate fee amount', () => {
    expect(computeFees(BigNumber.from(100), BigNumber.from(1000)).toString()).toEqual('10') // 1%
    expect(computeFees(BigNumber.from(30), BigNumber.from(1000)).toString()).toEqual('3') // 0.3%
  })
})
