import * as React from 'react'
import styled from 'styled-components/native'
import { contentDirection } from '../constants/contentDirection'
import { ThemeType } from 'build-configs'

const Identifier = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  color: ${props => props.theme.colors.textColor};
`
type DetailContainerPropsType = {
  language: string
  children: React.ReactNode
  theme: ThemeType
}
const DetailContainer = styled.Text<DetailContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.textColor};
`
type PropsType = {
  identifier: string
  information: string
  theme: ThemeType
  language: string
}

class PageDetail extends React.PureComponent<PropsType> {
  render() {
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
