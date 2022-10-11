import { Moment } from 'moment'
import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import DateFormatter from 'api-client/src/i18n/DateFormatter'

import { contentDirection } from '../constants/contentDirection'

const TimeStampText = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`
type DirectionContainerPropsType = {
  language: string
  children: React.ReactNode
}

const DirectionContainer = styled.View<DirectionContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`
type TimeStampPropsType = {
  lastUpdate: Moment
  formatter: DateFormatter
  showText?: boolean
  format?: string
}

export const TimeStamp = ({ lastUpdate, formatter, showText = true, format = 'LL' }: TimeStampPropsType): ReactElement => {
  const { i18n, t } = useTranslation('common')
  // only show day, month and year
  const dateText = formatter.format(lastUpdate, {
    format,
  })
  return (
    <DirectionContainer language={i18n.language}>
      {showText && <TimeStampText>{t('lastUpdate')} </TimeStampText>}
      <TimeStampText>{dateText}</TimeStampText>
    </DirectionContainer>
  )
}

export default TimeStamp
