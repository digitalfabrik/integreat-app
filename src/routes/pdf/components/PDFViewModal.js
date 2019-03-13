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

const getRelativeToDocumentsDir = (path: string) => {
  const documentsDirName = 'Documents'
  const index = path.indexOf(documentsDirName)

  if (index < 0) {
    return path
  }

  return path.substr(index + documentsDirName.length + 1)
}

const urlToPath = (url: string) => {
  return url.replace(URL_PREFIX, '')
}

export default class PDFViewModal extends React.Component<PropsType> {
  onError = (error: Error) => console.log('Cannot render PDF', error)

  render () {
    const path = urlToPath(this.props.navigation.getParam('url'))
    return (
      <View style={{flex: 1}}>
        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          // This PDFView can only load from Documents dir on iOS:
          // https://github.com/rumax/react-native-PDFView/issues/90
          resource={Platform.OS === 'ios' ? getRelativeToDocumentsDir(path) : path}
          resourceType={'file'}
          onError={this.onError}
        />
      </View>
    )
  }
}
