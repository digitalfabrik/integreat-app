import * as React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native-elements'
import { View } from 'react-native'

// fixme: Caption is connected to redux state because of H1 -> not a plain old component

class Caption extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return <React.Fragment>
      <Text>'sdf'</Text>
      <Text>'sdf'</Text>
      <Text>'sdf'</Text>
      <View><Text>'sdf'</Text></View>
    </React.Fragment>
  }
}

export default Caption
