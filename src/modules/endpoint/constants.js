// @flow

const overrideUrl = (window && window.localStorage && window.localStorage.getItem('api-url'))
export const apiUrl = overrideUrl || 'https://cms.integreat-app.de'
