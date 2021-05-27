import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import Footer from './Footer'
import CleanLink from './CleanLink'
import CleanAnchor from './CleanAnchor'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  city: string
  language: string
  t: TFunction
}

export class LocationFooter extends React.PureComponent<PropsType> {
  render() {
    const { t, city, language } = this.props
    const { aboutUrls, privacyUrls } = buildConfig()

    const aboutUrl = aboutUrls[language] || aboutUrls.default
    const privacyUrl = privacyUrls[language] || privacyUrls.default

    return (
      <Footer>
        {/* TODO Use right path */}
        {/* <CleanLink to={new DisclaimerRouteConfig().getRoutePath({ city, language })}> */}
        <CleanLink to='/'>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanAnchor>
        <CleanAnchor href={privacyUrl}>{t('privacy')}</CleanAnchor>
      </Footer>
    )
  }
}

export default withTranslation(['layout', 'settings'])(LocationFooter)
