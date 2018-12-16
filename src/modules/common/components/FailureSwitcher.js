// @flow

import React from 'react'
import { Text } from 'react-native'

export class FailureSwitcher extends React.Component<{ error: Error }> {
  render () {
    return <Text>
      {this.props.error.message}
    </Text>
  }
}

export default FailureSwitcher
