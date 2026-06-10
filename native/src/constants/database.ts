import BlobUtil from 'react-native-blob-util'

export const CONTENT_VERSION = 'v13'
export const RESOURCE_CACHE_VERSION = 'v4'

// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const CACHE_DIR_PATH = BlobUtil.fs.dirs.DocumentDir
export const UNVERSIONED_CONTENT_DIR_PATH = `${CACHE_DIR_PATH}/content`
// Offline saved content like categories, events and places
export const CONTENT_DIR_PATH = `${UNVERSIONED_CONTENT_DIR_PATH}/${CONTENT_VERSION}`
export const UNVERSIONED_RESOURCE_CACHE_DIR_PATH = `${CACHE_DIR_PATH}/resource-cache`
// Offline saved resources like pictures and pdf documents
export const RESOURCE_CACHE_DIR_PATH = `${UNVERSIONED_RESOURCE_CACHE_DIR_PATH}/${RESOURCE_CACHE_VERSION}`
