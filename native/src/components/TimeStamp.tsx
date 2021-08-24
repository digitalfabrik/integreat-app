import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Moment } from 'moment'
import styled from 'styled-components/native'
import { contentDirection } from '../constants/contentDirection'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { ThemeType } from 'build-configs'
import { ReactElement } from 'react'

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
type PropsType = {
  lastUpdate: Moment
  formatter: DateFormatter
  theme: ThemeType
  showText?: boolean
  format?: string
}

export const TimeStamp = ({
  lastUpdate,
  formatter,
  theme,
  showText = true,
  format = 'LL'
}: PropsType): ReactElement => {
  const { i18n, t } = useTranslation('common')
  // only show day, month and year
  const dateText = formatter.format(lastUpdate, {
    format
  })
  return (
    <DirectionContainer theme={theme} language={i18n.language}>
      {showText && <TimeStampText theme={theme}>{t('lastUpdate')} </TimeStampText>}
      <TimeStampText theme={theme}>{dateText}</TimeStampText>
    </DirectionContainer>
  )
}

export default TimeStamp
