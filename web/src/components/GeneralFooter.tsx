import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'
import CleanLink from './CleanLink'
import Footer from './Footer'

type PropsType = {
  language: string
}

const GeneralFooter = ({ language }: PropsType): ReactElement => {
  const { aboutUrls, privacyUrls } = buildConfig()
  const { t } = useTranslation('layout')

  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default

  return (
    <Footer>
      <CleanLink to={RoutePatterns[MAIN_DISCLAIMER_ROUTE]}>{t('imprintAndContact')}</CleanLink>
      <CleanLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanLink>
      <CleanLink to={privacyUrl}>{t('privacy')}</CleanLink>
      <CleanLink to={RoutePatterns[LICENSES_ROUTE]}>{t('settings:openSourceLicenses')}</CleanLink>
    </Footer>
  )
}

export default GeneralFooter
