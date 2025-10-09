export const MAX_DATE_RECURRENCES = 3
export const MAX_SEARCH_RESULTS = 75
export const TTS_MAX_TITLE_DISPLAY_CHARS = 20

export const SPRUNGBRETT_OFFER_ALIAS = 'sprungbrett'
export const MALTE_HELP_FORM_OFFER_ALIAS = 'help'
export const APPOINTMENT_BOOKING_OFFER_ALIAS = 'terminbuchung'

export const INTERNAL_OFFERS = [SPRUNGBRETT_OFFER_ALIAS, MALTE_HELP_FORM_OFFER_ALIAS]

export const getChatName = (appName: string): string => `Frag${appName} (beta)`
