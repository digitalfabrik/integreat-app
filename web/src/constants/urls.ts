import safeLocalStorage from '../utils/safeLocalStorage'
import buildConfig from './buildConfig'

export const cmsApiBaseUrl = safeLocalStorage.getItem('api-url') || buildConfig().cmsUrl
export const tunewsApiBaseUrl = 'https://tunews.integreat-app.de'
