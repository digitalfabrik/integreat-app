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
  renderStandardFooter = (): React.Node => {
    const { theme, slideCount, goToSlide, currentSlide, t } = this.props
    const goToPreviousSlide = () => goToSlide(slideCount - 1)
    const goToNextSlide = () => goToSlide(currentSlide + 1)

    return <Container theme={theme}>
      <SlideButton label={t('skip')} onPress={goToPreviousSlide} theme={theme} />
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('next')} onPress={goToNextSlide} theme={theme} />
    </Container>
  }

  renderCustomizableSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, onDone, toggleCustomizeSettings, theme, t } = this.props
    const saveSettings = () => onDone(Object.seal({}))
    return <Container theme={theme}>
      <SlideButton label={t('cancel')} onPress={toggleCustomizeSettings} theme={theme} />
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('save')} onPress={saveSettings} theme={theme} />
    </Container>
  }

  renderSettingsFooter = (): React.Node => {
    const { slideCount, currentSlide, goToSlide, onDone, toggleCustomizeSettings, theme, t } = this.props
    const onDecline = () => onDone({ allowPushNotifications: false, errorTracking: false, proposeNearbyCities: false })
    const onAccept = () => onDone({ allowPushNotifications: true, errorTracking: true, proposeNearbyCities: true })

    return <Container theme={theme}>
      <VerticalButtonContainer>
        <SlideButton label={t('customize')} onPress={toggleCustomizeSettings} theme={theme} />
        <SlideButton label={t('decline')} onPress={onDecline} theme={theme} />
      </VerticalButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('accept')} onPress={onAccept} theme={theme} backgroundColor={theme.colors.themeColor} />
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
