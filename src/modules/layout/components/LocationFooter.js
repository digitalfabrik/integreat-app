// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import Footer from './Footer'
import { goToDisclaimer } from '../../app/routes/disclaimer'
import CleanLink from '../../common/components/CleanLink'
import CleanAnchor from '../../common/components/CleanAnchor'

type PropsType = {
  city: string,
  language: string,
  t: TFunction
}

export class LocationFooter extends React.Component<PropsType> {
  render () {
    const {t, city, language} = this.props

    return <Footer>
      <CleanLink to={goToDisclaimer(city, language)}>{t('imprintAndContact')}</CleanLink>
      <CleanAnchor href={'https://integreat-app.de/datenschutz/'}>{t('privacy')}</CleanAnchor>
    </Footer>
  }
}

export default translate('layout')(LocationFooter)
