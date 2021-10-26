import * as Sentry from '@sentry/react-native'
import { last } from 'lodash'
import normalizeStrings from 'normalize-strings'
import RNFetchBlob from 'rn-fetch-blob'
import Url from 'url-parse'

import { FetchError, NotFoundError } from 'api-client/src'

import buildConfig from '../constants/buildConfig'
import AppSettings from './AppSettings'

export const initSentry = (): void => {
  if (!buildConfig().featureFlags.sentry) {
    // Native crashes do not get reported when the app is not a release build. Therefore we can disable sentry when
    // we recognize a dev build. This also adds consistency with the reporting of JS crashes.
    // This way we only report JS crashes exactly when native crashes get reported.
    return
  }

  Sentry.init({
    dsn: 'https://3dfd3051678042b2b04cb5a6c2d869a4@sentry.tuerantuer.org/2'
  })
}

const sentryEnabled = (): boolean => buildConfig().featureFlags.sentry
const developerFriendly = (): boolean => buildConfig().featureFlags.developerFriendly

export const log = (message: string, level = 'debug'): void => {
  if (sentryEnabled()) {
    Sentry.addBreadcrumb({
      message,
      level: Sentry.Severity.fromString(level)
    })
  }
  if (developerFriendly()) {
    switch (level) {
      case Sentry.Severity.Fatal:
      case Sentry.Severity.Critical:
      case Sentry.Severity.Error:
        // eslint-disable-next-line no-console
        console.error(message)
        break
      case Sentry.Severity.Warning:
        // eslint-disable-next-line no-console
        console.warn(message)
        break
      case Sentry.Severity.Log:
        // eslint-disable-next-line no-console
        console.log(message)
        break
      case Sentry.Severity.Info:
        // eslint-disable-next-line no-console
        console.info(message)
        break
      case Sentry.Severity.Debug:
        // eslint-disable-next-line no-console
        console.debug(message)
        break
    }
  }
}

export const reportError = (err: Error): void => {
  if (!(err instanceof NotFoundError) && !(err instanceof FetchError) && sentryEnabled()) {
    // Report important errors if sentry is enabled (and skip e.g. errors because of no invalid internet connection)
    Sentry.captureException(err)
  }
  if (developerFriendly()) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

// Android throws an error if attempting to delete non existing directories/files
// https://github.com/joltup/rn-fetch-blob/issues/333
export const deleteIfExists = async (path: string): Promise<void> => {
  if (await RNFetchBlob.fs.exists(path)) {
    await RNFetchBlob.fs.unlink(path)
  } else {
    log(`File or directory ${path} does not exist and was therefore not deleted.`, 'warning')
  }
}

export const determineApiUrl = async (): Promise<string> => {
  const appSettings = new AppSettings()
  const apiUrlOverride = await appSettings.loadApiUrlOverride()
  return apiUrlOverride || buildConfig().cmsUrl
}

/**
 * Iterates through a tree until depth is reached. A depth of 0 means only the root is visited.
 * A depth of 1 means the root and the children of it are visited. Please note that for each children of the root
 * nodeAction is called once with the category and null for the children as parameters.
 *
 * @param root The root to start iterating from
 * @param resolveChildren The function which is used to resolve children
 * @param depth The depth
 * @param nodeAction The action to trigger for each node and children
 */
export const forEachTreeNode = <T>(
  root: T,
  resolveChildren: (arg0: T) => Array<T>,
  depth: number,
  nodeAction: (arg0: T, arg1: Array<T> | null | undefined) => void
): void => {
  if (depth === 0) {
    nodeAction(root, null)
  } else {
    const children = resolveChildren(root)
    nodeAction(root, children)
    children.forEach(child => forEachTreeNode(child, resolveChildren, depth - 1, nodeAction))
  }
}

// This code is adopted from: https://github.com/react-navigation/react-navigation-core/blob/c85a22d78a50e853632a11036ce562e4e1ecb523/src/routers/KeyGenerator.ts
const uniqueBaseId = `route-id-${Date.now()}`
let uuidCount = 0
export const generateRouteKey = (): string => {
  uuidCount += 1
  return `${uniqueBaseId}-${uuidCount}`
}

/**
 * @throws {Error} If urlString is invalid or it is not possible to get an extension from it
 */

export const getExtension = (urlString: string): string => {
  const url = new Url(urlString)

  if (!url.protocol) {
    throw new Error('Invalid URL! Missing protocol.')
  }

  const { pathname } = url
  const lastPath = last(pathname.split('/'))

  if (lastPath === undefined) {
    throw new Error('The URL does not have a pathname!')
  }

  const index = lastPath.lastIndexOf('.')

  if (index === -1) {
    return ''
  }

  return lastPath.substring(index + 1)
}

export const normalizeSearchString = (str: string): string => normalizeStrings(str).toLowerCase()
