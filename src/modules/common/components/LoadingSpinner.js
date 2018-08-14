// @flow

import React from 'react'
import {CenteredSpinner} from './LoadingSpinner.styles'

class LoadingSpinner extends React.Component<{}> {
  render () {
    return <CenteredSpinner name='line-scale-party' />
  }
}

export default LoadingSpinner
