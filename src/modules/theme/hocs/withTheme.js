// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'
import type { ThemeType } from '../constants/theme'
import { lightTheme } from '../constants/theme'

function withTheme<Props: { theme: ThemeType }> (
  Component: React.AbstractComponent<Props>
): React.AbstractComponent<$Diff<Props, {| theme: ThemeType |}>> {
  return class extends React.Component<$Diff<Props, {| theme: ThemeType |}>> {
      static displayName = wrapDisplayName(Component, 'withTheme')

      render () {
        return <Component {...this.props} theme={lightTheme} />
      }
  }
}

export default withTheme
