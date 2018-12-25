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
    const url = this.props.navigation.getParam('url')
    return (
      <View style={{flex: 1}}>
        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          resource={url.substr(url.indexOf('Documents') + 'Documents'.length + 1)}
          resourceType={'file'}
          onError={this.onError}
        />
      </View>
    )
  }
}
