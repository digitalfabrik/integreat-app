import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Footer from './Footer'
import Link from 'redux-first-router-link'

class LocationFooter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const {t, location, language} = this.props

    return <Footer>
      <Link to={`/${location}/${language}/disclaimer`}>
        {t('imprintAndContact')}
      </Link>
      <a href={'https://integreat-app.de/datenschutz/'}>{t('privacy')}</a>
    </Footer>
  }
}

export default translate('layout')(LocationFooter)
