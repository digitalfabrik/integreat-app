// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import { goToI18nRedirect } from '../../app/routes/i18nRedirect'

type Props = {
  viewportSmall: boolean
}

export class GeneralHeader extends React.Component<Props> {
  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={goToI18nRedirect()}
                   actionItems={[new HeaderActionItem({href: goToI18nRedirect(), iconSrc: landingIcon})]} />
  }
}

export default GeneralHeader
