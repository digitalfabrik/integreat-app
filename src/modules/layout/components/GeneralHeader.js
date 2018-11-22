// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import I18nRedirectRouteConfig from '../../app/route-configs/I18nRedirectRouteConfig'

type PropsType = {|
  viewportSmall: boolean
|}

class GeneralHeader extends React.PureComponent<PropsType> {
  render () {
    const getPath = new I18nRedirectRouteConfig().getRoutePath
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={getPath({})}
                   actionItems={[new HeaderActionItem({href: getPath({}), iconSrc: landingIcon})]} />
  }
}

export default GeneralHeader
