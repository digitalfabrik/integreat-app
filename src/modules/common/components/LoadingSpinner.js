// @flow

import React from 'react'
import { CenteredSpinner } from './LoadingSpinner.styles'
import { withTheme } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

export class LoadingSpinner extends React.Component<{ theme: ThemeType }> {
  render () {
    return <CenteredSpinner name='line-scale-party' color={this.props.theme.colors.textColor} />
  }
}

// $FlowFixMe https://github.com/styled-components/styled-components/issues/1785
export default withTheme(LoadingSpinner)
