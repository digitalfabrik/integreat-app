import safeLocalStorage, { API_URL_KEY } from '../utils/safeLocalStorage'
import buildConfig from './buildConfig'

export const cmsApiBaseUrl = safeLocalStorage.getItem(API_URL_KEY) || buildConfig().cmsUrl
export const tuNewsApiBaseUrl = 'https://tunews.integreat-app.de'
export const bescheidEndpointBaseUrl = __BESCHEID_ENDPOINT_URL__
