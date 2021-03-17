// @flow

import React from 'react'
import { type TFunction, withTranslation } from 'react-i18next'
import type Moment from 'moment'
import styled, { type StyledComponent } from 'styled-components'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import type { ThemeType } from 'build-configs/ThemeType'

const TimeStamp: StyledComponent<{||}, ThemeType, *> = styled.p`
  padding-top: 15px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

type PropsType = {|
  lastUpdate: Moment,
  t: TFunction,
  withText: boolean,
  format?: string,
  className?: string,
  formatter: DateFormatter
|}

export const LastUpdateInfo = ({ lastUpdate, t, withText, className, formatter, format = 'LL' }: PropsType) => {
  // only show day, month and year
  const timestamp = formatter.format(lastUpdate, { format })
  return (
    <TimeStamp className={className}>
      {withText && t('lastUpdate')} {timestamp}
    </TimeStamp>
  )
}

export default withTranslation<PropsType>('common')(LastUpdateInfo)
