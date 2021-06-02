import * as React from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import { Moment } from 'moment'
import styled from 'styled-components/native'
import { contentDirection } from '../constants/contentDirection'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import { ThemeType } from 'build-configs'

const TimeStampText = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`
type DirectionContainerPropsType = {
  language: string
  children: React.ReactNode
  theme: ThemeType
}
const DirectionContainer = styled.View<DirectionContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`
type PropsType = {
  lastUpdate: Moment
  formatter: DateFormatter
  t: TFunction
  language: string
  theme: ThemeType
  showText?: boolean
  format?: string
}

export class TimeStamp extends React.PureComponent<PropsType> {
  render() {
    const { lastUpdate, formatter, t, language, theme, showText = true, format = 'LL' } = this.props
    // only show day, month and year
    const dateText = formatter.format(lastUpdate, {
      format
    })
    return (
      <DirectionContainer language={language} theme={theme}>
        {showText && <TimeStampText theme={theme}>{t('lastUpdate')} </TimeStampText>}
        <TimeStampText theme={theme}>{dateText}</TimeStampText>
      </DirectionContainer>
    )
  }
}

export default withTranslation('common')(TimeStamp)
