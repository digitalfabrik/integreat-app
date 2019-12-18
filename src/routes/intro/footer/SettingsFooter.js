// @flow

import * as React from 'react'
import SlideButton from './SlideButton'
import Pagination from './Pagination'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'
import type { IntroSettingsType } from '../IntroContainer'
import styled, { type StyledComponent } from 'styled-components/native'
import { FooterContainer } from './StandardFooter'

const VerticalButtonContainer: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
`

type PropsType = {|
  slideCount: number,
  currentSlide: number,
  onDone: ($Shape<IntroSettingsType>) => Promise<void>,
  toggleCustomizeSettings: () => void,
  goToSlide: (index: number) => void,
  theme: ThemeType,
  t: TFunction
|}

class SettingsFooter extends React.Component<PropsType> {
  onDecline = () =>
    this.props.onDone({ allowPushNotifications: false, errorTracking: false, proposeNearbyCities: false })
  onAccept = () =>
    this.props.onDone({ allowPushNotifications: true, errorTracking: true, proposeNearbyCities: true })

  render () {
    const { slideCount, currentSlide, goToSlide, toggleCustomizeSettings, theme, t } = this.props

    return <FooterContainer theme={theme}>
      <VerticalButtonContainer>
        <SlideButton label={t('customize')} onPress={toggleCustomizeSettings} theme={theme} />
        <SlideButton label={t('decline')} onPress={this.onDecline} theme={theme} />
      </VerticalButtonContainer>
      <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      <SlideButton label={t('accept')} onPress={this.onAccept} theme={theme}
                   backgroundColor={theme.colors.themeColor} />
    </FooterContainer>
  }
}

export default SettingsFooter
