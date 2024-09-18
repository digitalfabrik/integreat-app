import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Platform, useWindowDimensions, Button } from 'react-native'
import Tts, { TtsEventHandler } from 'react-native-tts'
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview'
import { useTheme } from 'styled-components/native'

import { CONSENT_ROUTE } from 'shared'
import { ErrorCode } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import { userAgent } from '../constants/endpoint'
import {
  ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE,
  HEIGHT_MESSAGE_TYPE,
  OPEN_SETTINGS_MESSAGE_TYPE,
  WARNING_MESSAGE_TYPE,
} from '../constants/webview'
import { AppContext } from '../contexts/AppContextProvider'
import { useAppContext } from '../hooks/useCityAppContext'
import useNavigate from '../hooks/useNavigate'
import renderHtml from '../utils/renderHtml'
import { log, reportError } from '../utils/sentry'
import Failure from './Failure'
import { ParsedCacheDictionaryType } from './Page'

export const renderWebviewError = (
  errorDomain: string | null | undefined,
  errorCode: number,
  errorDesc: string,
): React.ReactElement => (
  <Text>
    ${errorDomain} ${errorCode} ${errorDesc}
  </Text>
)

type RemoteContentProps = {
  content: string
  cacheDictionary: ParsedCacheDictionaryType
  language: string
  resourceCacheUrl: string
  onLinkPress: (url: string) => void
  onLoad: () => void
}

const extractSentencesFromHtml = (html: string) => {
  const cleanText = html.replace(/<\/?[^>]+(>|$)/g, '')
  const sentences = cleanText.split('.').map(sentence => sentence.trim())
  return sentences.filter(sentence => sentence.length > 0)
}

// If the app crashes without an error message while using RemoteContent, consider wrapping it in a ScrollView or setting a manual height
const RemoteContent = (props: RemoteContentProps): ReactElement | null => {
  const { onLoad, content, cacheDictionary, resourceCacheUrl, language, onLinkPress } = props
  const [error, setError] = useState<string | null>(null)
  const [pressedUrl, setPressedUrl] = useState<string | null>(null)
  const { settings, updateSettings } = useAppContext()
  const { navigateTo } = useNavigate()
  const { externalSourcePermissions } = settings

  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const [webViewHeight, setWebViewHeight] = useState<number>(defaultWebviewHeight)
  const theme = useTheme()
  const { t } = useTranslation()
  const { width: deviceWidth } = useWindowDimensions()
  const { languageCode } = useContext(AppContext)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const sentences = useMemo(() => extractSentencesFromHtml(content), [content])

  useEffect(() => {
    // If it takes too long returning false in onShouldStartLoadWithRequest the webview loads the pressed url anyway on android.
    // Therefore only set it to state and execute onLinkPress in useEffect.
    if (pressedUrl) {
      onLinkPress(pressedUrl)
      setPressedUrl(null)
    }
  }, [onLinkPress, pressedUrl])

  useEffect(() => {
    Tts.addEventListener('tts-progress', () => setIsPlaying(true))
    Tts.addEventListener('tts-cancel', () => setIsPlaying(false))
    Tts.addEventListener('tts-finish', () => {
      if (sentenceIndex < sentences.length - 1) {
        setSentenceIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
        setSentenceIndex(0)
      }
    })

    return () => {
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-cancel')
    }
  }, [sentenceIndex, sentences.length])
  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight || content.length === 0) {
      onLoad()
    }
  }, [onLoad, webViewHeight, content])

  useEffect(() => {
    if (isPlaying) {
      Tts.setDefaultLanguage(languageCode)
      Tts.speak(sentences[sentenceIndex])
    }
  }, [isPlaying, languageCode, sentenceIndex, sentences])

  const pauseReading = () => {
    Tts.stop()
    setIsPlaying(false)
  }

  // messages are triggered in renderHtml.ts
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const message = JSON.parse(event.nativeEvent.data)
      if (message.type === HEIGHT_MESSAGE_TYPE && typeof message.height === 'number') {
        setWebViewHeight(message.height)
        return
      }

      if (message.type === OPEN_SETTINGS_MESSAGE_TYPE) {
        navigateTo({ route: CONSENT_ROUTE })
        return
      }

      if (message.type === ALLOW_EXTERNAL_SOURCE_MESSAGE_TYPE && typeof message.source === 'string') {
        const source = message.source
        const updatedSources = { ...externalSourcePermissions, [source]: true }
        updateSettings({ externalSourcePermissions: updatedSources })
        return
      }

      if (message.type === WARNING_MESSAGE_TYPE) {
        log(message.message, 'warning')
      } else {
        const messageText: string | undefined = message.message
        const error = new Error(messageText ? JSON.stringify(messageText) : 'Unknown message received from webview')
        reportError(error)
        setError(error.message)
      }
    },
    [externalSourcePermissions, navigateTo, updateSettings],
  )

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      if (buildConfig().supportedIframeSources.some(source => event.url.includes(source))) {
        return true
      }
      if (event.url === new URL(resourceCacheUrl).href) {
        // Needed on iOS for the initial load
        return true
      }
      // block non click events on ios that come up with iframes to avoid opening the iframe source directly in browser
      if (event.navigationType !== 'click' && Platform.OS === 'ios') {
        return false
      }
      // If it takes too long returning false the webview loads the pressed url anyway on android.
      // Therefore only set it to state and execute onLinkPress in useEffect.
      setPressedUrl(event.url)
      return false
    },
    [resourceCacheUrl],
  )

  if (content.length === 0) {
    return null
  }
  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  // const startReading = () => {
  //   Tts.setDefaultLanguage(languageCode)
  //   const sentences = extractSentencesFromHtml(content);

  //   Tts.speak(sentences[sentenceCounter])
  //   // setIsPlaying(true)
  // }

  return (
    <>
      <WebView
        source={{
          baseUrl: resourceCacheUrl,
          html: renderHtml(
            content,
            cacheDictionary,
            buildConfig().supportedIframeSources,
            theme,
            language,
            externalSourcePermissions,
            t,
            deviceWidth,
            dimensions.pageContainerPaddingHorizontal,
          ),
        }}
        originWhitelist={['*']} // Needed by iOS to load the initial html
        javaScriptEnabled
        dataDetectorTypes='none'
        userAgent={userAgent}
        domStorageEnabled={false}
        allowsFullscreenVideo
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // To disable scrolling in iOS
        onMessage={onMessage}
        renderError={renderWebviewError}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        // To allow custom handling of link clicks in android
        // https://github.com/react-native-webview/react-native-webview/issues/1869
        setSupportMultipleWindows={false}
        style={{
          height: webViewHeight,
          opacity: 0.99, // fixes crashing in Android https://github.com/react-native-webview/react-native-webview/issues/811
        }}
      />
      <Button title={isPlaying ? 'Pause' : 'Read Text'} onPress={isPlaying ? pauseReading : () => setIsPlaying(true)} />
    </>
  )
}

export default RemoteContent
