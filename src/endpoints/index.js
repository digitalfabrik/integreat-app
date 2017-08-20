import LANGUAGE_ENDPOINT from './language'
import LOCATION_ENDPOINT from './location'
import PAGE_ENDPOINT from './page'
import DISCLAIMER_ENDPOINT from './disclaimer'
import Fetcher from './Fetcher'

export default [
  LANGUAGE_ENDPOINT,
  LOCATION_ENDPOINT,
  PAGE_ENDPOINT,
  DISCLAIMER_ENDPOINT
]

export const PageFetcher = Fetcher.createFetcher(PAGE_ENDPOINT)
export const DisclaimerFetcher = Fetcher.createFetcher(DISCLAIMER_ENDPOINT)
export const LanguageFetcher = Fetcher.createFetcher(LANGUAGE_ENDPOINT)
export const LocationFetcher = Fetcher.createFetcher(LOCATION_ENDPOINT)
