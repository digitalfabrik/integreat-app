// @flow

import * as React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import styled, { type StyledComponent } from 'styled-components/native'
import { type TFunction } from 'react-i18next'
import type { IntroSettingsType } from './IntroContainer'
import Pagination from './Pagination'
import SlideButton from './SlideButton'

const Container: StyledComponent<{}, ThemeType, *> = styled.View`
  flex: 0.15;
  flex-direction: row;
  padding: 16px 10px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-self: flex-end;
  align-content: flex-end;
  justify-content: flex-end;
`

const VerticalButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
`

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
  goToPreviousSlide = () => this.props.goToSlide(this.props.slideCount - 1)
  goToNextSlide = () => this.props.goToSlide(this.props.currentSlide + 1)

  onDecline = () =>
    this.props.onDone({ allowPushNotifications: false, errorTracking: false, proposeNearbyCities: false })
  onAccept = () =>
    this.props.onDone({ allowPushNotifications: true, errorTracking: true, proposeNearbyCities: true })
  onSave = () => this.props.onDone(Object.seal({}))

  renderStandardFooter = (): React.Node => {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props

    return <Container theme={theme}>
      <SlideButton label={t('skip')} onPress={this.goToPreviousSlide} theme={theme} />
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('next')} onPress={this.goToNextSlide} theme={theme} />
    </Container>
  }

  renderCustomizableSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, toggleCustomizeSettings, theme, t } = this.props

    return <Container theme={theme}>
      <SlideButton label={t('cancel')} onPress={toggleCustomizeSettings} theme={theme} />
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('save')} onPress={this.onSave} theme={theme} />
    </Container>
  }

  renderSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, toggleCustomizeSettings, theme, t } = this.props

    return <Container theme={theme}>
      <VerticalButtonContainer>
        <SlideButton label={t('customize')} onPress={toggleCustomizeSettings} theme={theme} />
        <SlideButton label={t('decline')} onPress={this.onDecline} theme={theme} />
      </VerticalButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('accept')} onPress={this.onAccept} theme={theme}
                   backgroundColor={theme.colors.themeColor} />
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
