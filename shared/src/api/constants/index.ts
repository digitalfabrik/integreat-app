export const API_VERSION = 'v3'

export const LOCAL_NEWS_SOURCE = 'local'
export const TU_NEWS_SOURCE = 'tunews'
export const AMAL_NEWS_SOURCE = 'amalnews'

export type NewsSource = typeof LOCAL_NEWS_SOURCE | typeof TU_NEWS_SOURCE | typeof AMAL_NEWS_SOURCE
