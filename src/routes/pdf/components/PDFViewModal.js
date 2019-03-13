// @flow

import PDFView from 'react-native-view-pdf'
import * as React from 'react'
import { View, Platform } from 'react-native'
import type { NavigationScreenProp } from 'react-navigation'
import { URL_PREFIX } from '../../../modules/platform/constants/webview'

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
          // This PDFView can only load from Documents dir on iOS:
          // https://github.com/rumax/react-native-PDFView/issues/90
          resource={Platform.OS === 'ios' ? url.substr(url.indexOf('Documents') + 'Documents'.length + 1) : url.replace(URL_PREFIX, '')}
          resourceType={'file'}
          onError={this.onError}
        />
      </View>
    )
  }
}
