// @flow

import React from 'react'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'

import Footer from './Footer'
import Link from 'redux-first-router-link'
import { goToDisclaimer } from '../../app/routes/disclaimer'

type PropsType = {
  city: string,
  language: string,
  t: TFunction
}

export class LocationFooter extends React.Component<PropsType> {
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
