import buildConfig from '../constants/buildConfig'
import openExternalUrl from './openExternalUrl'

const openPrivacyPolicy = async (language: string): Promise<void> => {
  const privacyUrl = buildConfig().privacyUrls[language] || buildConfig().privacyUrls.default
  openExternalUrl(privacyUrl)
}

export default openPrivacyPolicy
