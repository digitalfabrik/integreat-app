import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import { Dimensions, Linking, View } from 'react-native'
import HTML from 'react-native-render-html'

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  onLinkPress = (event, url) => {
    Linking.openURL(url)
  }

  render () {
    return (
      <View>
        <Caption title={this.props.title} />
        <HTML html={this.props.content} imagesMaxWidth={Dimensions.get('window').width}
              onLinkPress={this.onLinkPress} />
      </View>
    )
  }
}

export default Page
