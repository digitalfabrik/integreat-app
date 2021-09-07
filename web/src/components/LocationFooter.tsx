import React, { ReactNode } from 'react'
import { withTranslation, TFunction } from 'react-i18next'

import { DISCLAIMER_ROUTE } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { createPath } from '../routes'
import CleanAnchor from './CleanAnchor'
import CleanLink from './CleanLink'
import Footer from './Footer'

type PropsType = {
  city: string
  language: string
  t: TFunction
}

export class LocationFooter extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { t, city, language } = this.props
    const { aboutUrls, privacyUrls } = buildConfig()

    const aboutUrl = aboutUrls[language] || aboutUrls.default
    const privacyUrl = privacyUrls[language] || privacyUrls.default
    const disclaimerPath = createPath(DISCLAIMER_ROUTE, { cityCode: city, languageCode: language })

    return (
      <Footer>
        <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanAnchor>
        <CleanAnchor href={privacyUrl}>{t('privacy')}</CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(LocationFooter)
