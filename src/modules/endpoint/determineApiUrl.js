// @flow

import AppSettings from '../settings/AppSettings'
import buildConfig from '../app/constants/buildConfig'

export default async () => {
  const appSettings = new AppSettings()
  const apiUrlOverride = await appSettings.loadApiUrlOverride()
  return apiUrlOverride || buildConfig().cmsUrl
}
