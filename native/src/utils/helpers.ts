import last from 'lodash/last'
import BlobUtil from 'react-native-blob-util'
import Url from 'url-parse'

import buildConfig from '../constants/buildConfig'
import appSettings from './AppSettings'
import { log } from './sentry'

// Android throws an error if attempting to delete non existing directories/files
// https://github.com/joltup/rn-fetch-blob/issues/333
export const deleteIfExists = async (path: string): Promise<void> => {
  if (await BlobUtil.fs.exists(path)) {
    await BlobUtil.fs.unlink(path)
  } else {
    log(`File or directory ${path} does not exist and was therefore not deleted.`, 'warning')
  }
}

export const determineApiUrl = async (): Promise<string> => {
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

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'No error message available'
