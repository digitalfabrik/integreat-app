// @flow

import * as React from 'react'
import SlideButton from './SlideButton'
import Pagination from './Pagination'
import type { ThemeType } from '../../../modules/theme/constants'
import type { TFunction } from 'react-i18next'
import { ButtonContainer } from './StandardFooter'
import type { IntroSettingsType } from '../IntroContainer'
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

class CustomizableSettingsFooter extends React.Component<PropsType> {
  onSave = () => this.props.onDone(Object.seal({}))

  render() {
    const { slideCount, currentSlide, goToSlide, toggleCustomizeSettings, theme, t } = this.props

    return (
      <View style={{ flexDirection: 'column' }}>
        <ButtonContainer theme={theme}>
          <SlideButton label={t('cancel')} onPress={toggleCustomizeSettings} theme={theme} />
          <SlideButton label={t('save')} onPress={this.onSave} theme={theme} highlighted />
        </ButtonContainer>
        <Pagination slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} />
      </View>
    )
  }
}

export default CustomizableSettingsFooter
