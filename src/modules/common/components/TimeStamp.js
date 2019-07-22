// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import type Moment from 'moment'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { MomentFormatterType } from '../../i18n/context/MomentContext'

const TimeStampText: StyledComponent<{}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

type PropsType = {
  lastUpdate: Moment,
  formatter: MomentFormatterType,
  t: TFunction,
  language?: string,
  theme: ThemeType
}

export class TimeStamp extends React.PureComponent<PropsType> {
  render () {
    const { lastUpdate, formatter, t, language, theme } = this.props
    // only show day, month and year
    const dateText = formatter(lastUpdate, { format: 'LL', locale: language })
    return <TimeStampText theme={theme}>{t('lastUpdate')}{dateText}</TimeStampText>
  }
}

export default translate('categories')(TimeStamp)
