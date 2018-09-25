// @flow

import PDFView from 'react-native-view-pdf'
import * as React from 'react'
import { View } from 'react-native'
import type { NavigationScreenProp } from 'react-navigation'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  url: string
}

export default class PDFViewModal extends React.Component<PropsType> {
  onError = (error: Error) => console.log('Cannot render PDF', error)

  render () {
    return (
      <View style={{flex: 1}}>
        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          resource={this.props.navigation.getParam('url')}
          resourceType={'url'}
          onError={this.onError}
        />
      </View>
    )
  }
}
