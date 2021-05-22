import buildConfig from './buildConfig'

export const cmsApiBaseUrl = window.localStorage?.getItem('api-url') || buildConfig().cmsUrl
export const tunewsApiBaseUrl = 'https://tunews.integreat-app.de'
