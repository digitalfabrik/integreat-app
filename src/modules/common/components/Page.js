import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, Linking, StyleSheet, View, WebView, StatusBar } from 'react-native'
import Caption from './Caption'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height - 60 - StatusBar.currentHeight // height of header and caption
  }
})

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
      <>
        {/*<Caption title={this.props.title} style={styles.caption} />*/}
        <View style={styles.container}>
          <WebView
            source={{html: this.props.content}}
            originWhitelist={['*']}
          />
        </View>
      </>
    )
  }
}

export default Page
