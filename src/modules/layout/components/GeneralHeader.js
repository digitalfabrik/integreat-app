// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import { getI18nRedirectPath } from '../../app/routes/i18nRedirect'

type PropsType = {|
  viewportSmall: boolean
|}

class GeneralHeader extends React.Component<PropsType> {
  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={getI18nRedirectPath({})}
                   actionItems={[new HeaderActionItem({href: getI18nRedirectPath({}), iconSrc: landingIcon})]} />
  }
}

export default GeneralHeader
