import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'
import CleanLink from './CleanLink'
import Footer from './Footer'

type PropsType = {
  city: string
  language: string
  overlay?: boolean
}

const LocationFooter: React.FC<PropsType> = ({ city, language, overlay = false }: PropsType): ReactElement => {
  const { aboutUrls, privacyUrls } = buildConfig()
  const { t } = useTranslation(['layout', 'settings'])
  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  const disclaimerPath = pathnameFromRouteInformation({
    route: DISCLAIMER_ROUTE,
    cityCode: city,
    languageCode: language,
  })

  return (
    <Footer overlay={overlay}>
      <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
      <CleanLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanLink>
      <CleanLink to={privacyUrl}>{t('privacy')}</CleanLink>
      <CleanLink to={RoutePatterns[LICENSES_ROUTE]}>{t('settings:openSourceLicenses')}</CleanLink>
    </Footer>
  )
}

export default LocationFooter
