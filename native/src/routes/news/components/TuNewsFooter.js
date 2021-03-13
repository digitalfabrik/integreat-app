// @flow

import React, { useCallback, useContext } from 'react'
import type { ThemeType } from 'build-configs/ThemeType'
import { contentDirection } from '../../../modules/i18n/contentDirection'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import { tunewsWebsiteUrl } from '../../../modules/endpoint/constants'
import type Moment from 'moment'

const Container: StyledComponent<{| language: string |}, ThemeType, *> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
  border-radius: 5px;
  width: 95%;
  flex-wrap: wrap;
  align-self: center;
  padding: 5px;
  background-color: ${props => props.theme.colors.tunewsThemeColor};
`

const TunewsFooter: StyledComponent<{| underlined?: boolean, rightMargin: number |}, ThemeType, *> = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 12px;
  color: white;
  margin-right: ${props => props.rightMargin || 0}px;
  text-decoration-line: ${props => (props.underlined ? 'underline' : 'none')};
`

type PropsType = {|
  language: string,
  eNewsNo: string,
  date: Moment,
  theme: ThemeType
|}

const TuNewsFooter = ({ theme, language, eNewsNo, date }: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const openTunewsLink = useCallback(async () => {
    openExternalUrl(tunewsWebsiteUrl)
  }, [])

  return (
    <Container theme={theme} language={language}>
      <TunewsFooter theme={theme} rightMargin={3}>
        {eNewsNo}
      </TunewsFooter>
      <TunewsFooter
        rightMargin={3}
        onPress={openTunewsLink}
        theme={theme}
        underlined>
        tünews INTERNATIONAL
      </TunewsFooter>
      <TunewsFooter theme={theme} rightMargin={3}>
        {formatter.format(date, {
          format: 'LL'
        })}
      </TunewsFooter>
    </Container>
  )
}

export default TuNewsFooter
