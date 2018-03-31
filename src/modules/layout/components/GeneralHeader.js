// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import { goToI18nRedirect } from '../../app/routes/i18nRedirect'
import { connect } from 'react-redux'

type Props = {
  viewportSmall: boolean
}

class GeneralHeader extends React.Component<Props> {
  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={goToI18nRedirect()}
                   actionItems={[new HeaderActionItem({href: goToI18nRedirect(), iconSrc: landingIcon})]} />
  }
}

const mapStateToProps = state => ({
  viewportSmall: state.viewport.is.small
})

export default connect(mapStateToProps)(GeneralHeader)
