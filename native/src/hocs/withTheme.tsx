import * as React from 'react'

import { ThemeType } from 'build-configs'

import buildConfig from '../constants/buildConfig'
import wrapDisplayName from './wrapDisplayName'

const withTheme = <Props extends { theme: ThemeType }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'theme'>> => {
  return class extends React.Component<Omit<Props, 'theme'>> {
    static displayName = wrapDisplayName(Component, 'withTheme')

    render() {
      // @ts-ignore
      return <Component {...this.props} theme={buildConfig().lightTheme} />
    }
  }
}

export default withTheme
