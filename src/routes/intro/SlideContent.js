// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../modules/theme/constants/theme'

const Container: StyledComponent<{ width: number }, ThemeType, *> = styled.View`
  display: flex;
  justify-content: space-around;
  padding: 32px 16px 64px;
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
  width: ${props => props.width};
`

const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
  width: 100%;
`

const Heading: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 35px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
`

const ContentContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 2;
`

const Description: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
  text-align: center;
`

export type SlideContentType = {|
  key: string,
  title: string,
  description?: string,
  renderContent: () => React.Node
|}

type PropsType = {|
  item: SlideContentType,
  theme: ThemeType,
  width: number
|}

class SlideContent extends React.Component<PropsType> {
  render () {
    const { width, theme, item } = this.props

    return <Container theme={theme} width={width}>
      <TextContainer>
        <Heading theme={theme}>{item.title}</Heading>
      </TextContainer>
      <ContentContainer>
        {item.renderContent()}
      </ContentContainer>
      <TextContainer>
        {item.description && <Description theme={theme}>{item.description}</Description>}
      </TextContainer>
    </Container>
  }
}

export default SlideContent
