import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LICENSES_ROUTE, MAIN_DISCLAIMER_ROUTE } from 'shared'

import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes'
import Footer from './Footer'
import Link from './base/Link'

type GeneralFooterProps = {
  language: string
}

const GeneralFooter = ({ language }: GeneralFooterProps): ReactElement => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const { t } = useTranslation('layout')

  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[language] ?? accessibilityUrls?.default

  return (
    <Footer>
      <Link to={RoutePatterns[MAIN_DISCLAIMER_ROUTE]}>{t('disclaimer')}</Link>
      <Link to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</Link>
      <Link to={privacyUrl}>{t('privacy')}</Link>
      <Link to={RoutePatterns[LICENSES_ROUTE]}>{t('settings:openSourceLicenses')}</Link>
      {!!accessibilityUrl && <Link to={accessibilityUrl}>{t('accessibility')}</Link>}
    </Footer>
  )
}

export default GeneralFooter
