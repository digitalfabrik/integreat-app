// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../modules/theme/constants/theme'

const Slide: StyledComponent<{}, ThemeType, *> = styled.View`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  padding: 32px 16px 64px;
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const StyledHeading: StyledComponent<{}, ThemeType, *> = styled.Text`
  width: 100%;
  font-size: 26px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
`

const ContentContainer = styled.View`
  width: 100%;
  display: flex;
  flex: 0.5;
  flex-direction: column;
`

const Description: StyledComponent<{}, ThemeType, *> = styled.Text`
  width: 100%;
  display: flex;
  align-self: flex-end;
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  padding: 0 24px;
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
      <StyledHeading theme={theme}>{title}</StyledHeading>
      <ContentContainer>
        {children}
      </ContentContainer>
      <Description theme={theme}>{description}</Description>
    </Slide>
  }
}

export default SlideContent
