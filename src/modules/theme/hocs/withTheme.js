// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import type { ThemeType } from '../constants/theme'
import { brightColors } from '../constants/colors'
import dimensions from '../constants/dimensions'
import { arabicFonts, defaultFonts } from '../constants/fonts'

type MapPropsToLanguageType<Props> = Props => string

const ARABIC_LANGUAGES = ['ar', 'fa', 'ku']

const withTheme = <Props> (mapPropsToLanguage?: MapPropsToLanguageType<Props>) =>
  (Component: React.ComponentType<Props>): React.ComponentType<$Diff<Props, {| theme: ThemeType |}>> => {
    return class extends React.Component<{}> {
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

export default withTheme
