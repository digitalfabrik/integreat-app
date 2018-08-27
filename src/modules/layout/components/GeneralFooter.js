// @flow

import React from 'react'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'

import Footer from './Footer'
import Link from 'redux-first-router-link'
import { goToMainDisclaimer } from '../../app/routes/mainDisclaimer'

type PropsType = {
  t: TFunction
}

class GeneralFooter extends React.Component<PropsType> {
  render () {
    const {t} = this.props
    return (
      <Footer>
        <Link to={goToMainDisclaimer()}>{t('imprintAndContact')}</Link>
        <a href={'https://integreat-app.de/datenschutz/'}>{t('privacy')}</a>
      </Footer>
    )
  }
}

export default translate('layout')(GeneralFooter)
