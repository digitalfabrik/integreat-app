import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Navigation from 'modules/app/Navigation'
import Footer from './Footer'
import { Link } from 'redux-little-router'

class LocationFooter extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    return <Footer>
      <Link href={this.props.navigation.disclaimer}>{this.props.t('imprintAndContact')}</Link>
      //todo translate Datenschutz
      <a href={'https://integreat-app.de/datenschutz/'}>Datenschutz</a>
    </Footer>
  }
}

export default translate('app')(LocationFooter)
