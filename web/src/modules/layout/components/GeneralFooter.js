// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'

import Footer from './Footer'
import MainDisclaimerRouteConfig from '../../app/route-configs/MainDisclaimerRouteConfig'
import CleanAnchor from '../../common/components/CleanAnchor'
import CleanLink from '../../common/components/CleanLink'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  language: string,
  t: TFunction
|}

class GeneralFooter extends React.PureComponent<PropsType> {
  render () {
    const { language, t } = this.props
    const { aboutUrls, privacyUrls } = buildConfig()

    const aboutUrl = aboutUrls[language] || aboutUrls.default
    const privacyUrl = privacyUrls[language] || privacyUrls.default

    return (
      <Footer>
        <CleanLink to={new MainDisclaimerRouteConfig().getRoutePath()}>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={aboutUrl}>
          {t('settings:about', { appName: buildConfig().appName })}
        </CleanAnchor>
        <CleanAnchor href={privacyUrl}>
          {t('privacy')}
        </CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(GeneralFooter)
