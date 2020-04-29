// @flow

import appConfig from './appConfig'

export const cmsApiBaseUrl =
  (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('api-url')) ||
  appConfig.cmsUrl
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'

export const tuNewsApiBaseUrl = 'https://tunews.integreat-app.de'

export const localNewsApiBaseUrl = "https://cms-test.integreat-app.de/"

export const localNewsApiBaseUrlDev = "https://cms-dev.integreat-app.de/"
