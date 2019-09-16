// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import brightTheme from '../../constants/theme'
import type { ThemeType } from '../../constants/theme'

type MapPropsToLanguageType<Props> = Props => ?string

function withTheme<Props: { theme: ThemeType }> (
  mapPropsToLanguage?: MapPropsToLanguageType<$Diff<Props, {| theme: ThemeType |}>>
): (Component: React.AbstractComponent<Props>) => React.AbstractComponent<$Diff<Props, {| theme: ThemeType |}>> {
  return (Component: React.AbstractComponent<Props>): React.AbstractComponent<$Diff<Props, {| theme: ThemeType |}>> => {
    return class extends React.Component<$Diff<Props, {| theme: ThemeType |}>> {
      static displayName = wrapDisplayName(Component, 'withTheme')

      render () {
        return <Component {...this.props} theme={brightTheme} />
      }
    }
  }
}

export default withTheme
