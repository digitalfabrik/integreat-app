export const API_VERSION = 'v3'

export const LOCAL_NEWS_SOURCE = 'local'
export const TU_NEWS_SOURCE = 'tunews'
export const AMAL_NEWS_SOURCE = 'amalnews'

export type NewsSource = typeof LOCAL_NEWS_SOURCE | typeof TU_NEWS_SOURCE | typeof AMAL_NEWS_SOURCE

type NewsColorPalette = {
  secondary: { main: string }
  tuNews: { main: string }
  amalNews: { main: string }
}

export const getNewsColor = ({ palette, source }: { palette: NewsColorPalette; source: NewsSource }): string => {
  if (source === LOCAL_NEWS_SOURCE) {
    return palette.secondary.main
  }
  if (source === AMAL_NEWS_SOURCE) {
    return palette.amalNews.main
  }
  return palette.tuNews.main
}

export const getNewsSourceLabel = ({ t, source }: { t: (key: string) => string; source: NewsSource }): string => {
  if (source === LOCAL_NEWS_SOURCE) {
    return t('local')
  }
  if (source === AMAL_NEWS_SOURCE) {
    return 'Amal News'
  }
  return 'tuenews'
}
