import AppSettings from './AppSettings'
import buildConfig from '../constants/buildConfig'

export default async (): Promise<string> => {
  const appSettings = new AppSettings()
  const apiUrlOverride = await appSettings.loadApiUrlOverride()
  return apiUrlOverride || buildConfig().cmsUrl
}
