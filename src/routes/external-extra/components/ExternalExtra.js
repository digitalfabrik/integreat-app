// @flow

import * as React from 'react'
import { WebView } from 'react-native-webview'
import { Text } from 'react-native'
import { stringify } from 'query-string'

type PropsType = {|
  url: ?string,
  postData: ?Map<string, string>
|}

class ExternalExtra extends React.Component<PropsType> {
  render () {
    const {url, postData} = this.props
    const body = !postData ? '' : stringify(Object.fromEntries(postData))
    return <WebView
      source={{
        uri: url,
        method: postData ? 'POST' : 'GET',
        body
      }}
      useWebKit
      javaScriptEnabled

      dataDetectorTypes={'all'}
      domStorageEnabled={false}
      renderError={this.renderError}
    />
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }
}

export default ExternalExtra
