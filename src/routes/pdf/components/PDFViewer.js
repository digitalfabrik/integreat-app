// @flow

import PDFView from 'react-native-view-pdf'
import * as React from 'react'
import { View } from 'react-native'

export default class PDFViewer extends React.Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          resource={this.props.navigation.getParam('url')}
          resourceType={'url'}
          onError={error => console.log('Cannot render PDF', error)}
        />
      </View>
    )
  }
}
