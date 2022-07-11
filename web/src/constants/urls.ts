import safeLocalStorage, { API_URL_KEY } from '../utils/safeLocalStorage'
import buildConfig from './buildConfig'

export const cmsApiBaseUrl = safeLocalStorage.getItem(API_URL_KEY) || buildConfig().cmsUrl
export const tunewsApiBaseUrl = 'https://tunews.integreat-app.de'
