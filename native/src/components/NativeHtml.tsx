import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { defaultHTMLElementModels, Element, HTMLContentModel, RenderHTML } from 'react-native-render-html'
import { useTheme } from 'styled-components'

import { config } from 'translations'

import ExternalIcon from '../assets/ExternalLink.svg'
import { contentAlignment } from '../constants/contentDirection'
import useNavigateToLink from '../hooks/useNavigateToLink'
import { getErrorMessage } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'
import SimpleImage from './SimpleImage'

type NativeHtmlProps = {
  language: string
  content: string
  cacheDictionary?: Record<string, string>
}

const NativeHtml = React.memo(({ content, cacheDictionary, language }: NativeHtmlProps): ReactElement => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const navigateToLink = useNavigateToLink()
  const onLinkPress = useCallback(
    (_: unknown, url: string) => {
      const shareUrl = cacheDictionary
        ? Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
        : undefined
      navigateToLink(url, shareUrl || url)
    },
    [cacheDictionary, navigateToLink]
  )

  const onElement = useCallback(
    (element: Element) => {
      if (cacheDictionary) {
        try {
          const newHref = element.attribs.href && cacheDictionary[decodeURI(element.attribs.href)]
          const newSrc = element.attribs.src && cacheDictionary[decodeURI(element.attribs.src)]
          if (newHref || newSrc) {
            // eslint-disable-next-line no-param-reassign
            element.attribs = {
              ...element.attribs,
              ...(newHref && { href: newHref }),
              ...(newSrc && { src: newSrc }),
            }
          }
        } catch (e) {
          log(
            `${getErrorMessage(e)} occurred while decoding and looking for ${
              element.attribs.href || element.attribs.src
            } in the dictionary`,
            'error'
          )
          reportError(e)
        }
      }
    },
    [cacheDictionary]
  )

  const fonts = theme.fonts.native.webviewFont.split(', ')
  // rn-render-html renders fonts with rem units smaller than normal, and doesn't support calc()
  const factorForRenderHtmlPackage = 1.1
  const fontSize = `${parseFloat(theme.fonts.contentFontSize.slice(0, -'rem'.length)) * factorForRenderHtmlPackage}rem`

  const addExternalLinkMarkers = (text: string): string => {
    const externalAnchor = /<a.*class="link-external".*?(?=<\/a>)/g // ends before </a>
    const links = text.match(externalAnchor)
    if (!links) {
      return text
    }
    const textPieces = text.split(externalAnchor)
    const textWithMarkers = links
      .map((link, index) => `${textPieces[index] + link}<svg></svg>`)
      .concat(textPieces.slice(-1)) // one more text piece than links
      .join('')
    return textWithMarkers
  }

  return (
    <RenderHTML
      source={{
        html: addExternalLinkMarkers(content),
      }}
      contentWidth={width}
      defaultTextProps={{
        selectable: true,
        allowFontScaling: true,
      }}
      domVisitors={{ onElement }}
      renderersProps={{
        a: { onPress: onLinkPress },
        ol: { enableExperimentalRtl: true },
        ul: { enableExperimentalRtl: true },
      }}
      baseStyle={{
        fontSize,
        lineHeight: 24,
        color: theme.colors.textColor,
        textAlign: contentAlignment(language),
        direction: config.hasRTLScript(language) ? 'rtl' : 'ltr',
        fontFamily: theme.fonts.native.webviewFont,
      }}
      customHTMLElementModels={{
        svg: defaultHTMLElementModels.svg.extend({
          contentModel: HTMLContentModel.mixed,
        }),
      }}
      renderers={{
        svg: () => <SimpleImage style={{ marginLeft: 10, height: 14 }} source={ExternalIcon} />,
        // This renders all SVGs as ExternalIcon which should be fine because they can't be added in the CMS as SVGs
        // but if we do want to add other ones, then this renderer would break those SVGs and would need to be replaced
      }}
      systemFonts={fonts}
      tagsStyles={{
        figure: {
          margin: 0,
          marginBottom: 15,
          maxWidth: '100%',
          paddingLeft: 15,
          paddingRight: 15,
          fontSize: theme.fonts.hintFontSize,
          fontStyle: 'italic',
        },
      }}
    />
  )
})

export default NativeHtml
