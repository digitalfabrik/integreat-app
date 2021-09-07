import React, { ReactElement } from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Moment } from 'moment'

import DateFormatter from 'api-client/src/i18n/DateFormatter'

const TimeStamp = styled.p`
  padding-top: 15px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => props.theme.fonts.contentFontSize};
`

type PropsType = {
  lastUpdate: Moment
  t: TFunction
  withText: boolean
  format?: string
  className?: string
  formatter: DateFormatter
}

export const LastUpdateInfo = ({
  lastUpdate,
  t,
  withText,
  className,
  formatter,
  format = 'LL'
}: PropsType): ReactElement => {
  // only show day, month and year
  const timestamp = formatter.format(lastUpdate, { format })
  return (
    <TimeStamp className={className}>
      {withText && t('lastUpdate')} {timestamp}
    </TimeStamp>
  )
}

export default withTranslation('common')(LastUpdateInfo)
