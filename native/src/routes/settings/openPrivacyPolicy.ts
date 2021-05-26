import buildConfig from '../../modules/app/constants/buildConfig'
import openExternalUrl from '../../modules/common/openExternalUrl'

const openPrivacyPolicy = (language: string) => {
  const privacyUrl = buildConfig().privacyUrls[language] || buildConfig().privacyUrls.default
  openExternalUrl(privacyUrl)
}

export default openPrivacyPolicy
