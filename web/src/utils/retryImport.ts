import { ComponentType } from 'react'

const DEFAULT_RETRIES = 5
const DEFAULT_INTERVAL = 1000

/**
 * This function retries the loading a module if it fails
 * @param fn: passed function that return a promise f.e. lazy import
 * @param retriesLeft: attempts to retry the module loading
 * @param interval: delay between retry attemps
 */

const wait = (interval: number) => new Promise(resolve => setTimeout(resolve, interval))
const retryImport = async <T>(
  fn: () => Promise<{ default: ComponentType<T> }>,
  retriesLeft = DEFAULT_RETRIES,
  interval = DEFAULT_INTERVAL
): Promise<{ default: ComponentType<T> }> => {
  try {
    return fn()
  } catch (error) {
    await wait(interval)
    if (retriesLeft === 0) {
      throw new Error(error)
    }
    return retryImport(fn, retriesLeft - 1, interval)
  }
}

export default retryImport
