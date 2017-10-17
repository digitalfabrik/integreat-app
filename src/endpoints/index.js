import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import EVENTS_ENDPOINT from './events'
import DISCLAIMER_ENDPOINT from './disclaimer'
import createFetcher from './createFetcher'

export default [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT,
  EVENTS_ENDPOINT
]

export const EventsFetcher = createFetcher(EVENTS_ENDPOINT)
export const PageFetcher = createFetcher(PAGE_ENDPOINT)
export const DisclaimerFetcher = createFetcher(DISCLAIMER_ENDPOINT)
export const LanguageFetcher = createFetcher(LANGUAGE_ENDPOINT)
export const LocationFetcher = createFetcher(LOCATION_ENDPOINT)
