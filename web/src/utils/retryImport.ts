import { lazy, ComponentType, LazyExoticComponent } from 'react'

import { log } from './sentry'

const DEFAULT_RETRIES = 2
const DEFAULT_INTERVAL = 1000

const PAGE_FORCE_REFRESHED_KEY = 'page-force-refreshed'

const wait = (interval: number) => new Promise(resolve => setTimeout(resolve, interval))

/**
 * This function retries the loading a module if it fails
 * @param componentImport: passed function that return a promise f.e. lazy import
 * @param retriesLeft: attempts to retry the module loading
 * @param interval: delay between retry attempts
 */
const retry = async <T>(
  componentImport: () => Promise<{ default: ComponentType<T> }>,
  retriesLeft = DEFAULT_RETRIES,
  interval = DEFAULT_INTERVAL
): Promise<{ default: ComponentType<T> }> => {
  try {
    const component = componentImport()
    window.localStorage.setItem(PAGE_FORCE_REFRESHED_KEY, JSON.stringify(false))
    return component
  } catch (error: unknown) {
    log(`Failed to import, ${retriesLeft} retries left.`, 'warn')
    log(error instanceof Error ? error.message : 'Unknown error', 'warn')
    await wait(interval)
    if (retriesLeft === 0) {
      const json = window.localStorage.getItem(PAGE_FORCE_REFRESHED_KEY)
      const pageForceRefreshed = json ? JSON.parse(json) : false

      if (!pageForceRefreshed) {
        // Try force refreshing the page once
        log('Force refreshing now', 'warn')
        window.localStorage.setItem(PAGE_FORCE_REFRESHED_KEY, JSON.stringify(true))
        window.location.reload()
      } else {
        throw error instanceof Error ? error : new Error()
      }
    }
    return retry(componentImport, retriesLeft - 1, interval)
  }
}

const lazyWithRetry = <T>(
  componentImport: () => Promise<{ default: ComponentType<T> }>,
  retriesLeft = DEFAULT_RETRIES,
  interval = DEFAULT_INTERVAL
): LazyExoticComponent<ComponentType<T>> => lazy(() => retry(componentImport, retriesLeft, interval))

export default lazyWithRetry
