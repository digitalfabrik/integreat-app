import * as React from 'react'
import { ThemeType } from '../constants'
import { lightTheme } from '../constants'
import wrapDisplayName from '../../common/hocs/wrapDisplayName'

function withTheme<
  Props extends {
    theme: ThemeType
  }
>(Component: React.AbstractComponent<Props>): React.AbstractComponent<Omit<Props, 'theme'>> {
  return class extends React.Component<Omit<Props, 'theme'>> {
    static displayName = wrapDisplayName(Component, 'withTheme')

    render() {
      return <Component {...this.props} theme={lightTheme} />
    }
  }
}

export default withTheme
