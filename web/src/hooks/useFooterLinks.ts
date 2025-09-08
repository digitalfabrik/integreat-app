import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'

type FooterLinkItem = {
  to: string
  text: string
}

type UseFooterLinksProps = {
  language: string
  city?: string
}

const useFooterLinks = ({ language, city }: UseFooterLinksProps): FooterLinkItem[] => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const { t } = useTranslation(['layout', 'settings'])
  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[language] ?? accessibilityUrls?.default

  const disclaimerPath = city
    ? pathnameFromRouteInformation({
        route: DISCLAIMER_ROUTE,
        cityCode: city,
        languageCode: language,
      })
    : RoutePatterns[MAIN_DISCLAIMER_ROUTE]

  const licensesPath = city
    ? pathnameFromRouteInformation({
        route: LICENSES_ROUTE,
      })
    : RoutePatterns[LICENSES_ROUTE]

  return [
    { to: disclaimerPath, text: t('imprint') },
    { to: aboutUrl, text: t('settings:about', { appName: buildConfig().appName }) },
    { to: privacyUrl, text: t('privacy') },
    { to: licensesPath, text: t('settings:openSourceLicenses') },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: t('accessibility') }] : []),
  ]
}
export default useFooterLinks
