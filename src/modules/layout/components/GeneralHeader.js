import React from 'react'
import PropTypes from 'prop-types'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'
import { goToI18nRedirect } from '../../app/routes/i18nRedirect'

class GeneralHeader extends React.Component {
  static propTypes = {
    viewportSmall: PropTypes.bool.isRequired
  }

  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={'/'}
                   actionItems={[new HeaderActionItem({href: goToI18nRedirect(), iconSrc: landingIcon})]} />
  }
}

export default GeneralHeader
