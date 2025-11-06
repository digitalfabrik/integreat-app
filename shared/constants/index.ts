export const MAX_DATE_RECURRENCES = 3
export const MAX_SEARCH_RESULTS = 75
export const DEFAULT_ROWS_NUMBER = 4
export const SNACKBAR_AUTO_HIDE_DURATION = 5000
export const SPRUNGBRETT_OFFER_ALIAS = 'sprungbrett'
export const MALTE_HELP_FORM_OFFER_ALIAS = 'help'
export const APPOINTMENT_BOOKING_OFFER_ALIAS = 'terminbuchung'

export const INTERNAL_OFFERS = [SPRUNGBRETT_OFFER_ALIAS, MALTE_HELP_FORM_OFFER_ALIAS]

export const getChatName = (appName: string): string => `Frag ${appName} (beta)`

export type Rating = 'positive' | 'negative'

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export const RATING_POSITIVE: Rating = 'positive'
export const RATING_NEGATIVE: Rating = 'negative'
