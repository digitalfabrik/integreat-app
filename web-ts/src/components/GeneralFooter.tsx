import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import Footer from './Footer'
import CleanAnchor from './CleanAnchor'
import CleanLink from './CleanLink'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  language: string
  t: TFunction
}

class GeneralFooter extends React.PureComponent<PropsType> {
  render() {
    const { language, t } = this.props
    const { aboutUrls, privacyUrls } = buildConfig()

    const aboutUrl = aboutUrls[language] || aboutUrls.default
    const privacyUrl = privacyUrls[language] || privacyUrls.default

    return (
      <Footer>
        <CleanLink to='/disclaimer'>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanAnchor>
        <CleanAnchor href={privacyUrl}>{t('privacy')}</CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(GeneralFooter)
