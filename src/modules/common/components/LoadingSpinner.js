// @flow

import * as React from 'react'
import styled, { withTheme } from 'styled-components'
import Spinner from 'react-spinkit'
import type { ThemeType } from '../../theme/constants/theme'

const StyledSpinner = styled(Spinner)`
  margin-top: 50px;
  text-align: center;
`

type PropsType = {| theme: ThemeType |}

class LoadingSpinner extends React.PureComponent<PropsType> {
  render () {
    return <StyledSpinner name='line-scale-party' color={this.props.theme.colors.textColor} />
  }
}

export default withTheme(LoadingSpinner)
