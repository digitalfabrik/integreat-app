import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import Footer from './Footer'
import Link from 'redux-first-router-link'
import { goToMainDisclaimer } from '../../../app/routes/mainDisclaimer'

class GeneralFooter extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }
  render () {
    return <Footer>
      <Link to={goToMainDisclaimer()}>{this.props.t('imprintAndContact')}</Link>
      <a href={'https://integreat-app.de/datenschutz/'}>{this.props.t('privacy')}</a>
    </Footer>
  }
}

export default translate('layout')(GeneralFooter)
