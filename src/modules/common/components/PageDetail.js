// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import { contentDirection } from '../../i18n/contentDirection'

export const Identifier: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`

type DetailContainerPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const DetailContainer: StyledComponent<DetailContainerPropsType, ThemeType, *> = styled.Text`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`

type PropsType = {|
  identifier: string,
  information: string,
  theme: ThemeType,
  language: string
|}

class PageDetail extends React.PureComponent<PropsType> {
  render () {
    const { identifier, information, theme, language } = this.props
    return (
      <DetailContainer theme={theme} language={language}>
        <Identifier theme={theme}>{identifier}: </Identifier>
        {information}
      </DetailContainer>
    )
  }
}

export default PageDetail
