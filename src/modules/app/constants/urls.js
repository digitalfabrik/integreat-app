// @flow

export const cmsApiBaseUrl =
  (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('api-url')) ||
  __CONFIG__.cmsUrl
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'
