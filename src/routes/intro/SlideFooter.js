// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'

const Container = styled.View`
  flex: 0.2;
  flex-direction: row;
  padding: 16px;
`

const ButtonContainer: StyledComponent<{| backgroundColor: string |}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.backgroundColor};
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
`

const PaginationContainer = styled.View`
  flex: 2;
  flex-direction: row;
`

export type ButtonType = {|
  label: string,
  onPress: () => void,
  backgroundColor?: string
|}

type PropsType = {|
  leftButton: ButtonType,
  rightButton: ButtonType,
  slideCount: number,
  currentSlide: number,
  theme: ThemeType
|}

class SlideFooter extends React.Component<PropsType> {
  renderButton = (button: ButtonType): React.Node => {
    const { theme } = this.props
    return <ButtonContainer theme={theme} onPress={button.onPress}
                            backgroundColor={button.backgroundColor || theme.colors.backgroundColor}>
      <ButtonText theme={theme}>{button.label}</ButtonText>
    </ButtonContainer>
  }

  render () {
    const { leftButton, rightButton, slideCount, currentSlide, theme } = this.props
    return <Container>
      {this.renderButton(leftButton)}
      <PaginationContainer />
      {this.renderButton(rightButton)}
    </Container>
  }
}

export default SlideFooter
