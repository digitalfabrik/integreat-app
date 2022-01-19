import { lazy, ComponentType, LazyExoticComponent } from 'react'

const DEFAULT_RETRIES = 5
const DEFAULT_INTERVAL = 1000

/**
 * This function retries the loading a module if it fails
 * @param componentImport: passed function that return a promise f.e. lazy import
 * @param retriesLeft: attempts to retry the module loading
 * @param interval: delay between retry attemps
 */

const wait = (interval: number) => new Promise(resolve => setTimeout(resolve, interval))

const retry = async <T>(
  componentImport: () => Promise<{ default: ComponentType<T> }>,
  retriesLeft = DEFAULT_RETRIES,
  interval = DEFAULT_INTERVAL
): Promise<{ default: ComponentType<T> }> => {
  try {
    return componentImport()
  } catch (error: unknown) {
    await wait(interval)
    if (retriesLeft === 0) {
      throw error instanceof Error ? error : new Error()
    }
    return retry(componentImport, retriesLeft - 1, interval)
  }
}

export const lazyWithRetry = <T>(
  componentImport: () => Promise<{ default: ComponentType<T> }>,
  retriesLeft = DEFAULT_RETRIES,
  interval = DEFAULT_INTERVAL
): LazyExoticComponent<ComponentType<T>> => lazy(() => retry(componentImport, retriesLeft, interval))

export default lazyWithRetry
