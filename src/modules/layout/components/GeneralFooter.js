import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import Footer from './Footer'
import { Link } from 'redux-little-router'

class GeneralFooter extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }
  render () {
    return <Footer>
      <Link href={'/disclaimer'}>{this.props.t('imprintAndContact')}</Link>
      //todo translate Datenschutz
      <a href={'https://integreat-app.de/datenschutz/'}>Datenschutz</a>
    </Footer>
  }
}

export default translate('app')(GeneralFooter)
