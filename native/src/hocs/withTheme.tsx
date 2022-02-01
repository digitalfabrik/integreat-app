import * as React from 'react'

import { ThemeType } from 'build-configs'

import buildConfig from '../constants/buildConfig'
import wrapDisplayName from './wrapDisplayName'

const withTheme = <Props extends { theme: ThemeType }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'theme'>> =>
  // eslint-disable-next-line react/prefer-stateless-function
  class extends React.Component<Omit<Props, 'theme'>> {
    // eslint-disable-next-line react/static-property-placement
    static displayName = wrapDisplayName(Component, 'withTheme')

    render() {
      // @ts-expect-error
      return <Component {...this.props} theme={buildConfig().lightTheme} />
    }
  }

export default withTheme
