import RNFetchblob from 'rn-fetch-blob'

export const URL_PREFIX = 'file://'
// Our pdf view can only load from DocumentDir. Therefore we need to use that
export const OFFLINE_CACHE_PATH = RNFetchblob.fs.dirs.DocumentDir
