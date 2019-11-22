// @flow

export const testBaseUrl = 'https://cms-test.integreat-app.de'
export const liveBaseUrl = 'https://cms.integreat-app.de'
export const baseUrl = __DEV__ ? testBaseUrl : liveBaseUrl
export const wohnenApiBaseUrl = 'https://api.wohnen.integreat-app.de/v0'
export const allowedResourceHostNames = ['cms.integreat-app.de', 'cms-test.integreat-app.de']
