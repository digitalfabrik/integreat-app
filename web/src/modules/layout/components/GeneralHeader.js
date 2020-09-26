// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import I18nRedirectRouteConfig from '../../app/route-configs/I18nRedirectRouteConfig'
import { withTranslation } from 'react-i18next'
import { type TFunction } from 'i18next'

type PropsType = {|
  viewportSmall: boolean,
  t: TFunction
|}

class GeneralHeader extends React.PureComponent<PropsType> {
  render () {
    const { viewportSmall, t } = this.props
    const getPath = new I18nRedirectRouteConfig().getRoutePath
    return <Header viewportSmall={viewportSmall}
                   logoHref={getPath({})}
                   actionItems={[
                     <HeaderActionItemLink key='landing' href={getPath({})} iconSrc={landingIcon}
                                           text={t('changeLocation')} />
                   ]} />
  }
}

export default withTranslation('layout')(GeneralHeader)
