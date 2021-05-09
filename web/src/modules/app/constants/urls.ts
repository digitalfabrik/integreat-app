// @flow

import buildConfig from './buildConfig'

export const cmsApiBaseUrl =
  (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('api-url')) || buildConfig().cmsUrl
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'
export const tunewsApiBaseUrl = 'https://tunews.integreat-app.de'
