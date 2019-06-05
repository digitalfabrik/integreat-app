// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import type Moment from 'moment'
import styled from 'styled-components/native'
import type { MomentFormatterType } from '../../i18n/context/MomentContext'

const TimeStampText = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  /*font-family: ${props => props.theme.fonts.contentFontFamily};*/
  /*font-size: ${props => props.theme.fonts.contentFontSize};*/
`

type PropsType = {
  lastUpdate: Moment,
  formatter: MomentFormatterType,
  t: TFunction,
  language?: string
}

export class TimeStamp extends React.PureComponent<PropsType> {
  render () {
    const {lastUpdate, formatter, t, language} = this.props
    // only show day, month and year
    const dateText = formatter(lastUpdate, {format: 'LL', locale: language})
    return <TimeStampText>{t('lastUpdate')}{dateText}</TimeStampText>
  }
}

export default translate('categories')(TimeStamp)
