// @flow

import * as React from 'react'
import type { ThemeType } from '../../../modules/theme/constants'
import { type TFunction } from 'react-i18next'
import type { IntroSettingsType } from '../IntroContainer'
import StandardFooter from './StandardFooter'
import CustomizableSettingsFooter from './CustomizableSettingsFooter'
import SettingsFooter from './SettingsFooter'

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
  render() {
    const { customizableSettings, ...footerProps } = this.props
    const { currentSlide, slideCount, goToSlide, theme, t } = footerProps

    if (currentSlide < slideCount - 1) {
      return (
        <StandardFooter slideCount={slideCount} currentSlide={currentSlide} goToSlide={goToSlide} theme={theme} t={t} />
      )
    } else if (customizableSettings) {
      return <CustomizableSettingsFooter {...footerProps} />
    } else {
      return <SettingsFooter {...footerProps} />
    }
  }
}

export default SlideFooter
