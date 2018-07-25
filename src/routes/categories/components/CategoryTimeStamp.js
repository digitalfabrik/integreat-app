// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { TimeStamp } from './CategoryTimeStamp.styles'
import type Moment from 'moment'

type PropsType = {
  lastUpdate: Moment,
  t: TFunction,
  language: string
}

export class CategoryTimeStamp extends React.PureComponent<PropsType> {
  render () {
    const {lastUpdate, t, language} = this.props
    lastUpdate.locale(language)

    // only show day, month and year
    const timestamp = lastUpdate.format('LL')

    return <TimeStamp>{t('lastUpdate')}{timestamp}</TimeStamp>
  }
}

export default translate('categories')(CategoryTimeStamp)
