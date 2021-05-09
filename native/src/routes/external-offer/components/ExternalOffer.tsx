// @flow

import React, { useState, useRef, useEffect, useCallback } from 'react'
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

  useEffect(() => {
    const handleBackButton = (): boolean => {
      if (webviewRef.current && canGoBack) {
        webviewRef.current.goBack()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
    return () => backHandler.remove()
  }, [canGoBack])

  const { url, postData } = props
  const body = !postData ? '' : stringify(fromPairs([...postData.entries()]))

  const onNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack)
    },
    [setCanGoBack]
  )

  return (
    <WebView
      source={postData ? createPostSource(url, body) : createGetSource(url, body)}
      javaScriptEnabled
      dataDetectorTypes='none'
      domStorageEnabled={false}
      ref={webviewRef}
      /* The Lehrstellenradar does not work in the webview if you are navigating back (probably because of FormData?).
        Without this the webview itself shows an error which looks more like it is our fault.}
        Also, without disabling cache it is not possible to navigate back with hardware buttons anymore. */
      cacheEnabled={false}
      renderError={renderWebviewError}
      onNavigationStateChange={onNavigationStateChange}
    />
  )
}

export default ExternalOffer
