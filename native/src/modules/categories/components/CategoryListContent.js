// @flow

import * as React from 'react'
import { useCallback, useContext } from 'react'
import { useWindowDimensions } from 'react-native'
import Html, { GestureResponderEvent, type HTMLNode } from 'react-native-render-html'
import DateFormatterContext from '../../i18n/context/DateFormatterContext'
import styled from 'styled-components/native'
import type { ThemeType } from 'build-configs/ThemeType'
import Moment from 'moment'
import { config } from 'translations'
import TimeStamp from '../../common/components/TimeStamp'
import SpaceBetween from '../../common/components/SpaceBetween'
import { contentAlignment } from '../../i18n/contentDirection'

const HORIZONTAL_MARGIN = 8

const Container = styled.View`
  margin: 0 ${HORIZONTAL_MARGIN}px 0px;
`

const LastUpdateContainer = styled.View`
  margin: 15px 0;
`

type ContentPropsType = {|
  content: string,
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
  cacheDictionary: { [string]: string },
  language: string,
  lastUpdate?: Moment,
  theme: ThemeType
|}

const CategoryListContent = ({
  content,
  navigateToLink,
  cacheDictionary,
  language,
  lastUpdate,
  theme
}: ContentPropsType) => {
  const width = useWindowDimensions().width
  const formatter = useContext(DateFormatterContext)
  const onLinkPress = useCallback(
    (evt: GestureResponderEvent, url: string) => {
      const shareUrl = Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
      navigateToLink(url, language, shareUrl || url)
    },
    [cacheDictionary, navigateToLink, language]
  )

  const alterResources = useCallback(
    (node: HTMLNode) => {
      if (node.attribs) {
        const newHref = node.attribs.href && cacheDictionary[decodeURI(node.attribs.href)]
        const newSrc = node.attribs.src && cacheDictionary[decodeURI(node.attribs.src)]
        if (newHref || newSrc) {
          node.attribs = {
            ...node.attribs,
            ...(newHref && { href: newHref }),
            ...(newSrc && { src: newSrc })
          }
          return node
        }
      }
    },
    [cacheDictionary]
  )
  return (
    <SpaceBetween>
      <Container>
        <Html
          source={{ html: content }}
          contentWidth={width}
          defaultTextProps={{ selectable: true, allowFontStyling: true }}
          alterDOMElement={alterResources}
          renderersProps={{
            a: { onPress: onLinkPress },
            ol: { enableExperimentalRtl: true },
            ul: { enableExperimentalRtl: true }
          }}
          baseFontStyle={{
            fontSize: 14,
            fontFamily: theme.fonts.native.contentFontRegular,
            color: theme.colors.textColor
          }}
          tagsStyles={{
            ul: { direction: config.hasRTLScript(language) ? 'rtl' : 'ltr' },
            ol: { direction: config.hasRTLScript(language) ? 'rtl' : 'ltr' },
            p: { textAlign: contentAlignment(language) }
          }}
        />
        {lastUpdate && (
          <LastUpdateContainer>
            <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />
          </LastUpdateContainer>
        )}
      </Container>
    </SpaceBetween>
  )
}

export default CategoryListContent
