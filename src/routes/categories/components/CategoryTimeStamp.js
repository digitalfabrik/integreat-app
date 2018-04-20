// @flow

import React from 'react'
import type { I18nTranslate } from '../../../flowTypes'
import { translate } from 'react-i18next'
import { TimeStamp } from './CategoryTimeStamp.styles'

type Props = {
  timestamp: string,
  t: I18nTranslate
}

export class CategoryTimeStamp extends React.PureComponent<Props> {
  render () {
    const {timestamp, t} = this.props

    return <TimeStamp>{t('lastUpdate')}{timestamp}</TimeStamp>
  }
}

export default translate('categories')(CategoryTimeStamp)
