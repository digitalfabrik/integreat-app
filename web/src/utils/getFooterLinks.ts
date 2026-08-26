import { TFunction } from 'i18next'

import { IMPRINT_ROUTE, LICENSES_ROUTE, MAIN_IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'

import { FooterLinkItemProps } from '../components/FooterListItem'
import buildConfig from '../constants/buildConfig'

type GetFooterLinksProps = {
  languageCode: string
  regionCode?: string
  t: TFunction
}

const getFooterLinks = ({ languageCode, regionCode, t }: GetFooterLinksProps): FooterLinkItemProps[] => {
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
    { to: imprintPath, text: t($ => $.layout.imprint) },
    { to: aboutUrl, text: t($ => $.settings.aboutUs) },
    { to: privacyUrl, text: t($ => $.layout.privacy) },
    { to: licensesPath, text: t($ => $.settings.openSourceLicenses) },
    { to: linkToSbom, text: 'SBoM' },
    { to: accessibilityUrl, text: t($ => $.layout.accessibility) },
  ]
}

export default getFooterLinks
