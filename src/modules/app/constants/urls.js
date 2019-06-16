// @flow

import appConfig from './appConfig'

export const cmsApiBaseUrl =
  (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('api-url')) ||
  appConfig.cmsUrl
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'
