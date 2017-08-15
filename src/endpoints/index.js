import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import DISCLAIMER_ENDPOINT from './disclaimer'

export default [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT
]

export const PageFetcher = PAGE_ENDPOINT.withFetcher()
export const DisclaimerFetcher = DISCLAIMER_ENDPOINT.withFetcher()
export const LanguageFetcher = LANGUAGE_ENDPOINT.withFetcher()
export const LocationFetcher = LOCATION_ENDPOINT.withFetcher()
