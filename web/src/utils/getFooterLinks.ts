import { DISCLAIMER_ROUTE, LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'

type FooterLinkItem = {
  to: string
  text: string
}

type GetFooterLinksProps = {
  language: string
  city?: string
}

const getFooterLinks = ({ language, city }: GetFooterLinksProps): FooterLinkItem[] => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
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

  const licensesPath = pathnameFromRouteInformation({ route: LICENSES_ROUTE })

  return [
    { to: disclaimerPath, text: 'disclaimer' },
    { to: aboutUrl, text: 'settings:aboutUs' },
    { to: privacyUrl, text: 'privacy' },
    { to: licensesPath, text: 'settings:openSourceLicenses' },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: 'accessibility' }] : []),
  ]
}

export default getFooterLinks
