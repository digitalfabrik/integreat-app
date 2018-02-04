import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Footer from './Footer'
import { Link } from 'redux-little-router'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'

class LocationFooter extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    currentParams: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    return <Footer>
      <Link href={this.props.matchRoute(DisclaimerPage).stringify(this.props.currentParams)}>
        {this.props.t('imprintAndContact')}
      </Link>
      <a href={'https://integreat-app.de/datenschutz/'}>Datenschutz</a>
    </Footer>
  }
}

export default translate('app')(LocationFooter)
