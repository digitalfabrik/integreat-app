// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import Footer from './Footer'
import MainDisclaimerRouteConfig from '../../app/routeConfigs/mainDisclaimer'
import CleanAnchor from '../../common/components/CleanAnchor'
import CleanLink from '../../common/components/CleanLink'

type PropsType = {|
  t: TFunction
|}

class GeneralFooter extends React.Component<PropsType> {
  render () {
    const {t} = this.props
    return (
      <Footer>
        <CleanLink to={new MainDisclaimerRouteConfig().getRoutePath()}>{t('imprintAndContact')}</CleanLink>
        <CleanAnchor href={'https://integreat-app.de/datenschutz/'}>{t('privacy')}</CleanAnchor>
      </Footer>
    )
  }
}

export default translate('layout')(GeneralFooter)
