// @flow

import React from 'react'
import styled, { withTheme } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import Spinner from 'react-spinkit'

const CenteredSpinner = styled(Spinner)`
  margin-top: 50px;
  text-align: center;
`

export class LoadingSpinner extends React.Component<{ theme: ThemeType }> {
  render () {
    return <CenteredSpinner name='line-scale-party' color={this.props.theme.colors.textColor} />
  }
}

// $FlowFixMe https://github.com/styled-components/styled-components/issues/1785
export default withTheme(LoadingSpinner)
