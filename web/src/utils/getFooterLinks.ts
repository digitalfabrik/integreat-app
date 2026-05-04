import { IMPRINT_ROUTE, LICENSES_ROUTE, MAIN_IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'

import { FooterLinkItemProps } from '../components/FooterListItem'
import buildConfig from '../constants/buildConfig'

type GetFooterLinksProps = {
  languageCode: string
  regionCode?: string
}

const getFooterLinks = ({ languageCode, regionCode }: GetFooterLinksProps): FooterLinkItemProps[] => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
  const privacyUrl = privacyUrls[languageCode] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls[languageCode] ?? accessibilityUrls.default
  const linkToSbom = `https://github.com/digitalfabrik/integreat-app/releases/tag/${__VERSION_NAME__}`

  const imprintPath = regionCode
    ? pathnameFromRouteInformation({
        route: IMPRINT_ROUTE,
        regionCode,
        languageCode,
      })
    : `/${MAIN_IMPRINT_ROUTE}/${languageCode}`

  const licensesPath = `/${LICENSES_ROUTE}/${languageCode}`

  return [
    { to: imprintPath, text: 'imprint' },
    { to: aboutUrl, text: 'settings:aboutUs' },
    { to: privacyUrl, text: 'privacy' },
    { to: licensesPath, text: 'settings:openSourceLicenses' },
    { to: linkToSbom, text: 'SBoM', doNotTranslate: true },
    { to: accessibilityUrl, text: 'accessibility' },
  ]
}

export default getFooterLinks
