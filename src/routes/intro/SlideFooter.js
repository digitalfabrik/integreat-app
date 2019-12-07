// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'
import { range } from 'lodash'
import { type TFunction } from 'react-i18next'

const Container: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 0.1;
  flex-direction: row;
  padding: 16px 10px 25px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const ButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
`

const VerticalButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
`

const ButtonText: StyledComponent<{ backgroundColor: string }, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.backgroundColor};
  font-size: 18px;
  text-align: center;
  padding: 8px 12px;
  border-radius: 3px;
`

const DotsContainer = styled.View`
  flex: 1;
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
  onPress: () => void | Promise<void>,
  backgroundColor?: string
|}

type PropsType = {|
  slideCount: number,
  currentSlide: number,
  goToSlide: (index: number) => void,
  onDone: ($Shape<{| declineAll?: boolean, acceptAll?: boolean |}>) => Promise<void>,
  toggleCustomizeSettings: () => void,
  customizableSettings: boolean,
  theme: ThemeType,
  t: TFunction
|}

class SlideFooter extends React.Component<PropsType> {
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

  renderStandardFooter = (): React.Node => {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props
    return <Container theme={theme}>
      {this.renderButton({ label: t('skip'), onPress: () => goToSlide(slideCount - 1) })}
      {this.renderPagination()}
      {this.renderButton({ label: t('next'), onPress: () => goToSlide(currentSlide + 1) })}
    </Container>
  }

  renderCustomizableSettingsFooter = (): React.Node => {
    const { onDone, toggleCustomizeSettings, theme, t } = this.props
    return <Container theme={theme}>
      {this.renderButton({ label: t('back'), onPress: toggleCustomizeSettings })}
      {this.renderPagination()}
      {this.renderButton({ label: t('accept'), onPress: () => onDone(Object.seal({})) })}
    </Container>
  }

  renderSettingsFooter = (): React.Node => {
    const { onDone, toggleCustomizeSettings, theme, t } = this.props

    return <Container theme={theme}>
      <VerticalButtonContainer>
        {this.renderButton({ label: t('customize'), onPress: toggleCustomizeSettings })}
        {this.renderButton({ label: t('decline'), onPress: () => onDone({ declineAll: true }) })}
      </VerticalButtonContainer>
      {this.renderPagination()}
      {this.renderButton({
        label: t('accept'),
        onPress: () => onDone({ acceptAll: true }),
        backgroundColor: theme.colors.themeColor
      })}
    </Container>
  }

  render () {
    const { customizableSettings, currentSlide, slideCount } = this.props

    if (currentSlide < slideCount - 1) {
      return this.renderStandardFooter()
    } else if (customizableSettings) {
      return this.renderCustomizableSettingsFooter()
    } else {
      return this.renderSettingsFooter()
    }
  }
}

export default SlideFooter
