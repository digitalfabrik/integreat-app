import type { TFunction } from 'i18next'

export const API_VERSION = 'v3'

export const LOCAL_NEWS_SOURCE = 'local'
export const TU_NEWS_SOURCE = 'tunews'
export const AMAL_NEWS_SOURCE = 'amalnews'

export type NewsSource = typeof LOCAL_NEWS_SOURCE | typeof TU_NEWS_SOURCE | typeof AMAL_NEWS_SOURCE

type NewsColorPalette = {
  secondary: { main: string; contrastText: string }
  tuNews: { main: string; contrastText: string }
  amalNews: { main: string; contrastText: string }
}

type GetNewsColorProps = {
  palette: NewsColorPalette
  source: NewsSource
}

export const getNewsColor = ({ palette, source }: GetNewsColorProps): [string, string] => {
  if (source === LOCAL_NEWS_SOURCE) {
    return [palette.secondary.main, palette.secondary.contrastText]
  }
  if (source === AMAL_NEWS_SOURCE) {
    return [palette.amalNews.main, palette.amalNews.contrastText]
  }
  return [palette.tuNews.main, palette.tuNews.contrastText]
}

type GetNewsSourceLabelProps = {
  t: TFunction
  source: NewsSource
}

export const getNewsSourceLabel = ({ source, t }: GetNewsSourceLabelProps): string => {
  if (source === LOCAL_NEWS_SOURCE) {
    return t($ => $.news.sources.local)
  }
  if (source === AMAL_NEWS_SOURCE) {
    return 'Amal News'
  }
  return 'tuenews'
}
