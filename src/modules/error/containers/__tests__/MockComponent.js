// @flow

import * as React from 'react'
import { Text } from 'react-native'

class Mock extends React.Component {
  render () {
    return <Text>asdf</Text>
  }
}

export default jest.fn(() => <Mock />)
