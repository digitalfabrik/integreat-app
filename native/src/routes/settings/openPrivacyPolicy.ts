import buildConfig from '../../constants/buildConfig'
import openExternalUrl from '../../services/openExternalUrl'

const openPrivacyPolicy = (language: string) => {
  const privacyUrl = buildConfig().privacyUrls[language] || buildConfig().privacyUrls.default
  openExternalUrl(privacyUrl)
}

export default openPrivacyPolicy
