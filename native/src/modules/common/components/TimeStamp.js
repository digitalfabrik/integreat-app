// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type Moment from 'moment'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'
import type { MomentFormatterType } from '../../i18n/context/MomentContext'
import { contentDirection } from '../../i18n/contentDirection'

const TimeStampText: StyledComponent<{}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

type DirectionContainerPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const DirectionContainer: StyledComponent<DirectionContainerPropsType, ThemeType, *> = styled.View`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

type PropsType = {
  lastUpdate: Moment,
  formatter: MomentFormatterType,
  t: TFunction,
  language: string,
  theme: ThemeType
}

export class TimeStamp extends React.PureComponent<PropsType> {
  render () {
    const { lastUpdate, formatter, t, language, theme } = this.props
    // only show day, month and year
    const dateText = formatter(lastUpdate, {
      format: 'LL',
      locale: language
    })
    return <DirectionContainer language={language} theme={theme}>
      <TimeStampText theme={theme}>{t('lastUpdate', { lng: language })} </TimeStampText>
      <TimeStampText theme={theme}>{dateText}</TimeStampText>
    </DirectionContainer>
  }
}

export default withTranslation('common')(TimeStamp)
