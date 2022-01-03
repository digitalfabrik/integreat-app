import buildConfig from './buildConfig'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const cmsApiBaseUrl = window.localStorage?.getItem('api-url') || buildConfig().cmsUrl
export const tunewsApiBaseUrl = 'https://tunews.integreat-app.de'
