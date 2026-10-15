import { TFunction } from 'i18next'

import { IMPRINT_ROUTE, OPEN_SOURCE_ROUTE, MAIN_IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'

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

  const imprintPath = regionCode
    ? pathnameFromRouteInformation({
        route: IMPRINT_ROUTE,
        regionCode,
        languageCode,
      })
    : `/${MAIN_IMPRINT_ROUTE}/${languageCode}`

  const licensesPath = `/${OPEN_SOURCE_ROUTE}/${languageCode}`

  return [
    { to: imprintPath, text: t($ => $.about.imprint) },
    { to: aboutUrl, text: t($ => $.about.aboutUs) },
    { to: privacyUrl, text: t($ => $.common.privacy.title) },
    { to: licensesPath, text: t($ => $.about.openSources.title) },
    { to: accessibilityUrl, text: t($ => $.about.accessibility) },
  ]
}

export default getFooterLinks
