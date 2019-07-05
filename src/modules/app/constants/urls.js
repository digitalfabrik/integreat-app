// @flow

export const integreatApiBaseUrl =
  (window.localStorage && window.localStorage.getItem && window.localStorage.getItem('api-url')) ||
  'https://cms.integreat-app.de'
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'
