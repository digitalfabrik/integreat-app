import RNFetchblob from 'rn-fetch-blob'

export const URL_PREFIX = 'file://'
export const OFFLINE_CACHE_PATH = RNFetchblob.fs.dirs.DocumentDir // If we use cache the webview fails to display images
