import { DISCLAIMER_ROUTE, LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE, pathnameFromRouteInformation } from 'shared'

import { FooterLinkItemProps } from '../components/FooterListItem'
import buildConfig from '../constants/buildConfig'

type GetFooterLinksProps = {
  languageCode: string
  cityCode?: string
}

const getFooterLinks = ({ languageCode, cityCode }: GetFooterLinksProps): FooterLinkItemProps[] => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
  const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[languageCode] ?? accessibilityUrls?.default
  const linkToSbom = `https://github.com/digitalfabrik/integreat-app/releases/tag/${__VERSION_NAME__}`

  const disclaimerPath = cityCode
    ? pathnameFromRouteInformation({
        route: DISCLAIMER_ROUTE,
        cityCode,
        languageCode,
      })
    : `/${MAIN_DISCLAIMER_ROUTE}/${languageCode}`

  const licensesPath = `/${LICENSES_ROUTE}/${languageCode}`

  return [
    { to: disclaimerPath, text: 'disclaimer' },
    { to: aboutUrl, text: 'settings:aboutUs' },
    { to: privacyUrl, text: 'privacy' },
    { to: licensesPath, text: 'settings:openSourceLicenses' },
    { to: linkToSbom, text: 'SBoM', doNotTranslate: true },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: 'accessibility' }] : []),
  ]
}

export default getFooterLinks
