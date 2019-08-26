// @flow

import styled from 'styled-components'
import Spinner from 'react-spinkit'

const LoadingSpinner = styled(Spinner).attrs(props => ({
  name: 'line-scale-party', color: props.theme.colors.textColor
}))`
  margin-top: 50px;
  text-align: center;
`

export default LoadingSpinner
