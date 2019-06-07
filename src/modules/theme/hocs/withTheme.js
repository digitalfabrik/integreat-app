// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import type { ThemeType } from '../constants/theme'
import { brightColors } from '../constants/colors'
import dimensions from '../constants/dimensions'
import { arabicFonts, defaultFonts } from '../constants/fonts'

type MapPropsToLanguageType<Props> = Props => string

const ARABIC_LANGUAGES = ['ar', 'fa', 'ku']

function withTheme<Props: { theme: ThemeType }> (
  mapPropsToLanguage?: MapPropsToLanguageType<$Diff<Props, {| theme: ThemeType |}>>
): (Component: React.AbstractComponent<Props>) => React.AbstractComponent<$Diff<Props, {| theme: ThemeType |}>> {
  return (Component: React.AbstractComponent<Props>): React.AbstractComponent<$Diff<Props, {| theme: ThemeType |}>> => {
    return class extends React.Component<$Diff<Props, {| theme: ThemeType |}>> {
      static displayName = wrapDisplayName(Component, 'withTheme')

      render () {
        const language = mapPropsToLanguage && mapPropsToLanguage(this.props)
        const theme: ThemeType = {
          colors: brightColors,
          dimensions,
          fonts: language && ARABIC_LANGUAGES.includes(language) ? arabicFonts : defaultFonts
        }
        return <Component {...this.props} theme={theme} />
      }
    }
  }
}

export default withTheme
