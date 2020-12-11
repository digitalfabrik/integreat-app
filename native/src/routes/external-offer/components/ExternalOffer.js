// @flow

import * as React from 'react'
import { WebView } from 'react-native-webview'
import { Text } from 'react-native'
import { stringify } from 'query-string'
import { fromPairs } from 'lodash'
import { createGetSource, createPostSource } from '../../../modules/platform/constants/webview'

export type PropsType = {|
  url: string,
  postData: ?Map<string, string>
|}

class ExternalOffer extends React.Component<PropsType> {
  render () {
    const { url, postData } = this.props

    const body = !postData ? '' : stringify(fromPairs([...postData.entries()]))
    return <WebView
      source={postData ? createPostSource(url, body) : createGetSource(url, body)}
      javaScriptEnabled
      dataDetectorTypes='none'
      domStorageEnabled={false}
      renderError={this.renderError}
    />
  }

  renderError = (errorDomain: ?string, errorCode: number, errorDesc: string) => {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }
}

export default ExternalOffer
