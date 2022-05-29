type InvalidOrder = { orderHash: string; type: string; message: string }

// eslint-disable-next-line import/prefer-default-export
export function throwInvalidOrder({ orderHash, type, message }: InvalidOrder): never {
  // eslint-disable-next-line no-throw-literal
  throw {
    message: new Error(message),
    type,
    orderHash
  }
}
