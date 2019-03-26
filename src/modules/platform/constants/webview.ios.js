// @flow

import RNFetchblob from 'rn-fetch-blob'

export const URL_PREFIX = 'file://'
// Our pdf view can only load from DocumentDir. Therefore we need to use that
const CACHE_DIR_PATH = RNFetchblob.fs.dirs.DocumentDir

export const CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content`
export const RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache`
export const getResourceCacheFilesDirPath = (city: string) => `${RESOURCE_CACHE_DIR_PATH}/${city}/files`
