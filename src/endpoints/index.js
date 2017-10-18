import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import EVENTS_ENDPOINT from './events'
import DISCLAIMER_ENDPOINT from './disclaimer'
import createFetcher from './withFetcher'

export default [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT,
  EVENTS_ENDPOINT
]

export const EventsFetcher = withFetcher(EVENTS_ENDPOINT)
export const PageFetcher = withFetcher(PAGE_ENDPOINT)
export const DisclaimerFetcher = withFetcher(DISCLAIMER_ENDPOINT)
export const LanguageFetcher = withFetcher(LANGUAGE_ENDPOINT)
export const LocationFetcher = withFetcher(LOCATION_ENDPOINT)
