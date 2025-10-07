import { DISCLAIMER_ROUTE, LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'

type FooterLinkItem = {
  to: string
  text: string
}

type GetFooterLinksProps = {
  languageCode: string
  cityCode?: string
}

const getFooterLinks = ({ languageCode, cityCode }: GetFooterLinksProps): FooterLinkItem[] => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
  const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[languageCode] ?? accessibilityUrls?.default

  const disclaimerPath = cityCode
    ? pathnameFromRouteInformation({
        route: DISCLAIMER_ROUTE,
        cityCode,
        languageCode,
      })
    : `/${MAIN_DISCLAIMER_ROUTE}/${languageCode}`

  const licensesPath = `/${LICENSES_ROUTE}/${languageCode}`

  return [
    { to: disclaimerPath, text: 'imprint' },
    { to: aboutUrl, text: 'settings:aboutUs' },
    { to: privacyUrl, text: 'privacy' },
    { to: licensesPath, text: 'settings:openSourceLicenses' },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: 'accessibility' }] : []),
  ]
}

export default getFooterLinks
