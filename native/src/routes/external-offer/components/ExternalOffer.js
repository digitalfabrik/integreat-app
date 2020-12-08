// @flow

import React, { type Element } from 'react'
import { WebView } from 'react-native-webview'
import { Text } from 'react-native'
import { stringify } from 'query-string'
import { fromPairs } from 'lodash'
import { createGetSource, createPostSource } from '../../../modules/platform/constants/webview'

export type PropsType = {|
  url: string,
  postData: ?Map<string, string>
|}

const ExternalOffer = (props: PropsType) => {
  function renderError (errorDomain: ?string, errorCode: number, errorDesc: string): Element<*> {
    return <Text>${errorDomain} ${errorCode} ${errorDesc}</Text>
  }

  const { url, postData } = props
  const body = !postData ? '' : stringify(fromPairs([...postData.entries()]))

  return <WebView
    source={postData ? createPostSource(url, body) : createGetSource(url, body)}
    javaScriptEnabled
    dataDetectorTypes={['all']}
    domStorageEnabled={false}
    renderError={renderError}
  />
}

export default ExternalOffer
