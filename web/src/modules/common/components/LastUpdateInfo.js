// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type Moment from 'moment'
import styled from 'styled-components'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

const TimeStamp = styled.p`
  padding-top: 15px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

type PropsType = {|
  lastUpdate: Moment,
  t: TFunction,
  withText: boolean,
  className?: string,
  formatter: DateFormatter
|}

export const LastUpdateInfo = ({
  lastUpdate,
  t,
  withText,
  className,
  formatter
}: PropsType) => {
  // only show day, month and year
  const timestamp = formatter.format(lastUpdate, { format: 'LL' })
  return <TimeStamp className={className}>{withText && t('lastUpdate')} {timestamp}</TimeStamp>
}

export default withTranslation('common')(LastUpdateInfo)
