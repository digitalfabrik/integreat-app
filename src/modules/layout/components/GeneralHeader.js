// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import i18nRoute from '../../app/routes/i18nRedirect'

type PropsType = {|
  viewportSmall: boolean
|}

class GeneralHeader extends React.Component<PropsType> {
  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={i18nRoute.getRoutePath({})}
                   actionItems={[new HeaderActionItem({href: i18nRoute.getRoutePath({}), iconSrc: landingIcon})]} />
  }
}

export default GeneralHeader
