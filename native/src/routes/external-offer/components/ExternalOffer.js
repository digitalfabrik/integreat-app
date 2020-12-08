// @flow

import React, { useState, useRef, useEffect } from 'react'
import { WebView, type WebViewNavigation } from 'react-native-webview'
import { stringify } from 'query-string'
import { fromPairs } from 'lodash'
import { createGetSource, createPostSource } from '../../../modules/platform/constants/webview'
import { renderWebviewError } from '../../../modules/common/components/RemoteContent'
import { BackHandler } from 'react-native'

export type PropsType = {|
  url: string,
  postData: ?Map<string, string>
|}

const ExternalOffer = (props: PropsType) => {
  const [canGoBack, setCanGoBack] = useState(false)
  const webviewRef = useRef(null)

  const handleBackButton = (): boolean => {
    if (webviewRef.current && canGoBack) {
      webviewRef.current.goBack()
      return true
    }
    return false
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
    return () => backHandler.remove()
  }, [])

  const { url, postData } = props
  const body = !postData ? '' : stringify(fromPairs([...postData.entries()]))

  function onNavigationStateChange (navState: WebViewNavigation) {
    setCanGoBack(navState.canGoBack)
  }

  return <WebView
    source={postData ? createPostSource(url, body) : createGetSource(url, body)}
    javaScriptEnabled
    dataDetectorTypes={['all']}
    domStorageEnabled={false}
    ref={webviewRef}

    renderError={renderWebviewError}
    onNavigationStateChange={onNavigationStateChange}
  />
}

export default ExternalOffer
