// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../modules/theme/constants/theme'

const Slide: StyledComponent<{}, ThemeType, *> = styled.View`
  display: flex;
  justify-content: space-around;
  padding: 32px 16px 64px;
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Container = styled.View`
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
  display: flex;
  flex: 2;
`

const Description: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
  text-align: center;
`

type PropsType = {|
  title: string,
  description: string,
  children: React.Node,
  theme: ThemeType
|}

class SlideContent extends React.Component<PropsType> {
  render () {
    const { theme, title, description, children } = this.props
    return <Slide theme={theme}>
      <Container>
        <Heading theme={theme}>{title}</Heading>
      </Container>
      <ContentContainer>
        {children}
      </ContentContainer>
      <Container>
        <Description theme={theme}>{description}</Description>
      </Container>
    </Slide>
  }
}

export default SlideContent
