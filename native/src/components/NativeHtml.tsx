import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { ReactElement, useCallback } from 'react'
import { config } from 'translations'
import { contentAlignment } from '../constants/contentDirection'
import { RenderHTML, Element } from 'react-native-render-html'
import { useTheme } from 'styled-components'

type PropsType = {
  language: string
  content: string
  cacheDictionary?: Record<string, string>
  navigateToLink: (url: string, language: string, shareUrl: string) => void
}

const NativeHtml = ({ content, navigateToLink, cacheDictionary, language }: PropsType): ReactElement => {
  const theme = useTheme()
  const width = useWindowDimensions().width
  const onLinkPress = useCallback(
    (_, url: string) => {
      const shareUrl = cacheDictionary
        ? Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
        : undefined
      navigateToLink(url, language, shareUrl || url)
    },
    [cacheDictionary, navigateToLink, language]
  )

  const onElement = useCallback(
    (element: Element) => {
      if (element.attribs && cacheDictionary) {
        const newHref = element.attribs.href && cacheDictionary[decodeURI(element.attribs.href)]
        const newSrc = element.attribs.src && cacheDictionary[decodeURI(element.attribs.src)]
        if (newHref || newSrc) {
          element.attribs = {
            ...element.attribs,
            ...(newHref && { href: newHref }),
            ...(newSrc && { src: newSrc })
          }
        }
      }
    },
    [cacheDictionary]
  )

  const fonts = theme.fonts.native.webviewFont.split(', ')

  return (
    <RenderHTML
      source={{
        html: content
      }}
      contentWidth={width}
      defaultTextProps={{
        selectable: true,
        allowFontScaling: true
      }}
      domVisitors={{ onElement }}
      renderersProps={{
        a: { onPress: onLinkPress },
        ol: { enableExperimentalRtl: true },
        ul: { enableExperimentalRtl: true }
      }}
      baseStyle={{
        fontSize: theme.fonts.contentFontSize,
        letterSpacing: 0.5,
        lineHeight: 24,
        color: theme.colors.textColor,
        textAlign: contentAlignment(language),
        direction: config.hasRTLScript(language) ? 'rtl' : 'ltr'
      }}
      systemFonts={fonts}
    />
  )
}

export default NativeHtml
