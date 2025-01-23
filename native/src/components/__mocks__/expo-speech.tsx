// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const speak = jest.fn((text: string, options?: any) => {
  if (Boolean(options) && typeof options.onDone === 'function') {
    setTimeout(() => {
      options.onDone()
    }, 100)
  }
})

export const stop = jest.fn()
