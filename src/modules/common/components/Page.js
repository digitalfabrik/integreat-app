import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import { View } from 'react-native'

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  render () {
    return (
      <View>
        <Caption title={this.props.title} />
      </View>
    )
  }
}

export default Page
