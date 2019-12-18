// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'
import { type TFunction } from 'react-i18next'
import type { IntroSettingsType } from './IntroContainer'
import Pagination from './Pagination'

const Container: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 0.15;
  flex-direction: row;
  padding: 16px 10px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-self: flex-end;
  align-content: flex-end;
  justify-content: flex-end;
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

export type ButtonType = {|
  label: string,
  onPress: () => void | Promise<void>,
  backgroundColor?: string
|}

type PropsType = {|
  slideCount: number,
  currentSlide: number,
  goToSlide: (index: number) => void,
  onDone: ($Shape<IntroSettingsType>) => Promise<void>,
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

  renderStandardFooter = (): React.Node => {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props
    return <Container theme={theme}>
      {this.renderButton({ label: t('skip'), onPress: () => goToSlide(slideCount - 1) })}
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      {this.renderButton({ label: t('next'), onPress: () => goToSlide(currentSlide + 1) })}
    </Container>
  }

  renderCustomizableSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, onDone, toggleCustomizeSettings, theme, t } = this.props
    return <Container theme={theme}>
      {this.renderButton({ label: t('cancel'), onPress: toggleCustomizeSettings })}
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      {this.renderButton({ label: t('save'), onPress: () => onDone(Object.seal({})) })}
    </Container>
  }

  renderSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, onDone, toggleCustomizeSettings, theme, t } = this.props

    return <Container theme={theme}>
      <VerticalButtonContainer>
        {this.renderButton({ label: t('customize'), onPress: toggleCustomizeSettings })}
        {this.renderButton(
          { label: t('decline'),
            onPress: () => onDone({ allowPushNotifications: false, errorTracking: false, proposeNearbyCities: false })
        })}
      </VerticalButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      {this.renderButton({
        label: t('accept'),
        onPress: () => onDone({ allowPushNotifications: true, errorTracking: true, proposeNearbyCities: true }),
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
