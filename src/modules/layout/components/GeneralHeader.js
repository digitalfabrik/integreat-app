import React from 'react'
import PropTypes from 'prop-types'
import locationIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItem from '../HeaderActionItem'

class GeneralHeader extends React.Component {
  static propTypes = {
    viewportSmall: PropTypes.bool.isRequired
  }

  render () {
    return <Header viewportSmall={this.props.viewportSmall}
                   logoHref={'/'}
                   actionItems={[new HeaderActionItem({href: '/', iconSrc: locationIcon})]} />
  }
}

export default GeneralHeader
