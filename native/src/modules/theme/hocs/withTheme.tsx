import * as React from 'react'
import { ThemeType, lightTheme } from '../constants'
import wrapDisplayName from '../../common/hocs/wrapDisplayName'

function withTheme<Props extends { theme: ThemeType }>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, 'theme'>> {
  return class extends React.Component<Omit<Props, 'theme'>> {
    static displayName = wrapDisplayName(Component, 'withTheme')

    render() {
      // @ts-ignore
      return <Component {...this.props} theme={lightTheme} />
    }
  }
}

export default withTheme
