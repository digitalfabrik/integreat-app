import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import { View, Dimensions } from 'react-native'
import HTML from 'react-native-render-html'

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  render () {
    return (
      <View>
        <Caption title={this.props.title} />
        <HTML html={this.props.content} imagesMaxWidth={Dimensions.get('window').width} />
      </View>
    )
  }
}

export default Page
