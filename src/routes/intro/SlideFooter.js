// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'
import { range } from 'lodash'
import { type TFunction } from 'react-i18next'

const Container: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 0.1;
  flex-direction: row;
  padding: 16px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const ButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const ButtonText: StyledComponent<{ backgroundColor: string }, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.backgroundColor};
  font-size: 18px;
  text-align: center;
  padding: 8px 16px;
  border-radius: 3px;
`

const DotsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Dot: StyledComponent<{ isActive: boolean }, ThemeType, *> = styled.TouchableOpacity`
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
  slideCount: number,
  currentSlide: number,
  goToSlide: (index: number) => void,
  onRefuse: () => void,
  onContinue: () => void,
  theme: ThemeType,
  t: TFunction
|}

class SlideFooter extends React.Component<PropsType> {
  skipButton = (): ButtonType => ({
    label: this.props.t('skip'),
    onPress: () => this.props.goToSlide(this.props.slideCount - 1)
  })

  refuseButton = (): ButtonType => ({
    label: this.props.t('refuse'),
    onPress: this.props.onRefuse
  })

  nextButton = (currentIndex: number): ButtonType => ({
    label: this.props.t('next'),
    onPress: () => this.props.goToSlide(++currentIndex)
  })

  continueButton = (): ButtonType => ({
    label: this.props.t('continue'),
    onPress: this.props.onContinue,
    backgroundColor: this.props.theme.colors.themeColor
  })

  renderButton = (button: ButtonType): React.Node => {
    const { theme } = this.props
    return <ButtonContainer theme={theme} onPress={button.onPress}>
      <ButtonText theme={theme} backgroundColor={button.backgroundColor || theme.colors.backgroundColor}>
        {button.label}
      </ButtonText>
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
    const { currentSlide, slideCount, theme } = this.props

    const leftButton = currentSlide === slideCount - 1 ? this.refuseButton() : this.skipButton()
    const rightButton = currentSlide === slideCount - 1 ? this.continueButton() : this.nextButton(currentSlide)

    return <Container theme={theme}>
      {this.renderButton(leftButton)}
      {this.renderPagination()}
      {this.renderButton(rightButton)}
    </Container>
  }
}

export default SlideFooter
