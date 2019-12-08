// @flow

import AppSettings from '../settings/AppSettings'
import { baseUrl } from './constants'

export default async () => {
  const appSettings = new AppSettings()
  const apiUrlOverride = appSettings.loadApiUrlOverride()
  return apiUrlOverride || baseUrl
}
