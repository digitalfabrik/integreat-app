import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Footer from './Footer'
import Link from 'redux-first-router-link'
import { goToDisclaimer } from '../../../app/routes/disclaimer'

export class LocationFooter extends React.Component {
  static propTypes = {
    city: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  render () {
    const {t, city, language} = this.props

    return <Footer>
      <Link to={goToDisclaimer(city, language)}>
        {t('imprintAndContact')}
      </Link>
      <a href={'https://integreat-app.de/datenschutz/'}>{t('privacy')}</a>
    </Footer>
  }
}

export default translate('layout')(LocationFooter)
