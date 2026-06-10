export const MAX_DATE_RECURRENCES = 3
export const MAX_SEARCH_RESULTS = 75
export const MAX_NUMBER_OF_ALIASES_SHOWN = 3
export const DEFAULT_ROWS_NUMBER = 4
export const SNACKBAR_AUTO_HIDE_DURATION = 5000
export const SPRUNGBRETT_OFFER_ALIAS = 'sprungbrett'
export const MALTE_HELP_FORM_OFFER_ALIAS = 'help'
export const APPOINTMENT_BOOKING_OFFER_ALIAS = 'terminbuchung'

export const INTERNAL_OFFERS = [SPRUNGBRETT_OFFER_ALIAS, MALTE_HELP_FORM_OFFER_ALIAS]

export const getChatName = (appName: string): string => `Frag ${appName.replace('TestCms', '')}`

export type Rating = 'positive' | 'negative'

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export const RATING_POSITIVE: Rating = 'positive'
export const RATING_NEGATIVE: Rating = 'negative'

export type ThemeType = 'light' | 'contrast'

export const THEME_LIGHT: ThemeType = 'light'
export const THEME_CONTRAST: ThemeType = 'contrast'

export const REGION_SEARCH_EXAMPLE = 'Landkreis München'

export const CHAT_DEFAULT_POLLING_INTERVAL = 15000
export const CHAT_TYPING_POLLING_INTERVAL = 3000

export const QR_CODE_SIZE = 240

export const NEWS_ALL_SOURCES_FILTER = 'all'
export const NEWS_LOCAL_SOURCES_FILTER = 'local'
export const NEWS_NATIONAL_SOURCES_FILTER = 'national'

export type NewsSourceFilter =
  | typeof NEWS_ALL_SOURCES_FILTER
  | typeof NEWS_LOCAL_SOURCES_FILTER
  | typeof NEWS_NATIONAL_SOURCES_FILTER

export const NEWS_SOURCE_FILTERS: NewsSourceFilter[] = [
  NEWS_ALL_SOURCES_FILTER,
  NEWS_LOCAL_SOURCES_FILTER,
  NEWS_NATIONAL_SOURCES_FILTER,
]
