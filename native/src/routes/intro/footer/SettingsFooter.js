// @flow

import * as React from 'react'
import SlideButton from './SlideButton'
import Pagination from './Pagination'
import type { ThemeType } from '../../../modules/theme/constants'
import type { TFunction } from 'react-i18next'
import type { IntroSettingsType } from '../IntroContainer'
import { ButtonContainer } from './StandardFooter'
import { View } from 'react-native'

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

  onAccept = () => this.props.onDone({ allowPushNotifications: true, errorTracking: true, proposeNearbyCities: true })

  render() {
    const { slideCount, currentSlide, goToSlide, toggleCustomizeSettings, theme, t } = this.props

    return (
      <View>
        <ButtonContainer theme={theme}>
          <SlideButton label={t('customize')} onPress={toggleCustomizeSettings} theme={theme} />
          <SlideButton label={t('decline')} onPress={this.onDecline} theme={theme} />
          <SlideButton label={t('accept')} onPress={this.onAccept} theme={theme} highlighted />
        </ButtonContainer>
        <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      </View>
    )
  }
}

export default SettingsFooter
