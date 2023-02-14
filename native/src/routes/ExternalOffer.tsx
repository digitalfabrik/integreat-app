import { fromPairs } from 'lodash'
import { stringify } from 'query-string'
import React, { useState, useRef, useEffect, useCallback, ReactElement } from 'react'
import { BackHandler } from 'react-native'
import { WebView, WebViewNavigation } from 'react-native-webview'

import { renderWebviewError } from '../components/RemoteContent'
import { userAgent } from '../constants/endpoint'
import { createGetSource, createPostSource } from '../constants/webview'

export type ExternalOfferProps = {
  url: string
  postData: Map<string, string> | null | undefined
}

const ExternalOffer = (props: ExternalOfferProps): ReactElement => {
  const [canGoBack, setCanGoBack] = useState<boolean>(false)
  const webviewRef = useRef<WebView>(null)
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
  const onNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack)
    },
    [setCanGoBack]
  )
  return (
    <WebView
      source={postData ? createPostSource(url, stringify(fromPairs([...postData.entries()]))) : createGetSource(url)}
      javaScriptEnabled
      dataDetectorTypes='none'
      domStorageEnabled={false}
      userAgent={userAgent}
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
