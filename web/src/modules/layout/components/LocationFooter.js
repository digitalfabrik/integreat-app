// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'

import Footer from './Footer'
import DisclaimerRouteConfig from '../../app/route-configs/DisclaimerRouteConfig'
import CleanLink from '../../common/components/CleanLink'
import CleanAnchor from '../../common/components/CleanAnchor'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  city: string,
  language: string,
  onClick: () => void,
  t: TFunction
|}

export class LocationFooter extends React.PureComponent<PropsType> {
  render () {
    const { t, city, language, onClick } = this.props

    return <Footer onClick={onClick}>
      <CleanLink to={new DisclaimerRouteConfig().getRoutePath({ city, language })}>
        {t('imprintAndContact')}
      </CleanLink>
      <CleanAnchor href={`https://integreat-app.de${language === 'de' ? '/about/' : '/en/about/'}`}>
        {t('settings:about', { appName: buildConfig().appName })}
      </CleanAnchor>
      <CleanAnchor href={`https://integreat-app.de${language === 'de' ? '/datenschutz/' : '/en/privacy/'}`}>
        {t('privacy')}
      </CleanAnchor>
    </Footer>
  }
}

export default withTranslation(['layout', 'settings'])(LocationFooter)
