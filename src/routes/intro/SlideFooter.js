// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'
import { range } from 'lodash'

const Container = styled.View`
  flex: 0.1;
  flex-direction: row;
  padding: 16px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const ButtonContainer: StyledComponent<{| backgroundColor: string, end: boolean |}, ThemeType, *> =
  styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.backgroundColor};
  align-content: ${props => props.end ? 'flex-end' : 'flex-start'};
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  text-align: center;
`

const DotsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Dot: StyledComponent<{| isActive: boolean |}, ThemeType, *> = styled.TouchableOpacity`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-horizontal: 4px;
  background-color: ${props => props.isActive
    ? props.theme.colors.textSecondaryColor
    : props.theme.colors.textDecorationColor};
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
  goToSlide: (index: number) => void,
  theme: ThemeType
|}

class SlideFooter extends React.Component<PropsType> {
  renderButton = (button: ButtonType, end: boolean): React.Node => {
    const { theme } = this.props
    return <ButtonContainer theme={theme} onPress={button.onPress} end={end}
                            backgroundColor={button.backgroundColor || theme.colors.backgroundColor}>
      <ButtonText theme={theme}>{button.label}</ButtonText>
    </ButtonContainer>
  }

  renderPagination = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, theme } = this.props
    const goToSlideIndex = (index: number) => () => goToSlide(index)

    return <DotsContainer>
      {range(slideCount).map(index =>
        <Dot key={index} isActive={index === currentSlide} onPress={goToSlideIndex(index)} theme={theme} />
      )}
    </DotsContainer>
  }

  render () {
    const { leftButton, rightButton, theme } = this.props
    return <Container theme={theme}>
      {this.renderButton(leftButton, false)}
      {this.renderPagination()}
      {this.renderButton(rightButton, true)}
    </Container>
  }
}

export default SlideFooter
