// @flow

import RNFetchblob from 'rn-fetch-blob'
import { Platform } from 'react-native'
import { CONTENT_VERSION, RESOURCE_CACHE_VERSION } from '../../endpoint/persistentVersions'

export const URL_PREFIX = 'file://'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = RNFetchblob.fs.dirs.DocumentDir

export const CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content/${CONTENT_VERSION}`
export const RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache/${RESOURCE_CACHE_VERSION}`
export const getResourceCacheFilesDirPath = (city: string) => `${RESOURCE_CACHE_DIR_PATH}/${city}/files`
export const getResourceCacheFilesPath = (city: string) => `${RESOURCE_CACHE_DIR_PATH}/${city}/files.json`
export const getFontFaceSource = (fontName: string) => Platform.select({
  ios: `local('${fontName}') url('${fontName}.ttf') format('truetype')`,
  android: `url('file:///android_asset/fonts/${fontName}.ttf') format('truetype')`
})
