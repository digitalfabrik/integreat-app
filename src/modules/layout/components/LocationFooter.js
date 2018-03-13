import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Footer from './Footer'
import { Link } from 'redux-little-router'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'

class LocationFooter extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  getCurrentParams () {
    return {
      location: this.props.location,
      language: this.props.language
    }
  }

  render () {
    return <Footer>
      <Link href={this.props.matchRoute(DisclaimerPage).stringify(this.getCurrentParams())}>
        {this.props.t('imprintAndContact')}
      </Link>
      <a href={'https://integreat-app.de/datenschutz/'}>{this.props.t('privacy')}</a>
    </Footer>
  }
}

export default translate('layout')(LocationFooter)
