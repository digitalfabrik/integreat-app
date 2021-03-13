// @flow

import * as React from 'react'
import { useCallback, useContext } from 'react'
import { useWindowDimensions, Text, View } from 'react-native'
import Html, { GestureResponderEvent, type HTMLNode } from 'react-native-render-html'
import DateFormatterContext from '../../i18n/context/DateFormatterContext'
import styled from 'styled-components/native'
import type { ThemeType } from 'build-configs/ThemeType'
import Moment from 'moment'
import { config } from 'translations'
import TimeStamp from '../../common/components/TimeStamp'
import SpaceBetween from '../../common/components/SpaceBetween'

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

const textDistanceToBullet = 10
const listIndent = 20
const bulletSizeRelativeToFont = 2.8
const bulletAlignmentRelativeToFont = 2

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
  const onLinkPress = useCallback((evt: GestureResponderEvent, url: string) => {
    const shareUrl = Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
    navigateToLink(url, language, shareUrl || url)
  }, [cacheDictionary, navigateToLink, language])

  const alterResources = useCallback((node: HTMLNode) => {
    if (node.attribs) {
      if (node.attribs.href) {
        const newResource = cacheDictionary[decodeURI(node.attribs.href)]
        if (newResource) {
          node.attribs = {
            ...(node.attribs || {}),
            href: newResource
          }
          return node
        }
      } else if (node.attribs.src) {
        const newResource = cacheDictionary[decodeURI(node.attribs.src)]
        if (newResource) {
          node.attribs = {
            ...(node.attribs || {}),
            src: newResource
          }
          return node
        }
      }
    }
  }, [cacheDictionary])

  // TODO: remove with IGAPP-378
  const renderUnorderedListPrefix = useCallback((htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { baseFontStyle } = passProps
    const baseFontSize = baseFontStyle.fontSize
    return <View style={{
      width: baseFontSize / bulletSizeRelativeToFont,
      height: baseFontSize / bulletSizeRelativeToFont,
      borderRadius: baseFontSize / bulletSizeRelativeToFont,
      marginTop: baseFontSize / bulletAlignmentRelativeToFont,
      marginRight: config.hasRTLScript(language) ? listIndent : textDistanceToBullet,
      marginLeft: config.hasRTLScript(language) ? textDistanceToBullet : listIndent,
      backgroundColor: theme.colors.textColor
    }} />
  }, [language, theme])

  // TODO: remove with IGAPP-378
  const renderOrderedListPrefix = useCallback((htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { baseFontSize, allowFontScaling, index } = passProps
    return <Text allowFontScaling={allowFontScaling} style={{
      fontSize: baseFontSize,
      marginRight: config.hasRTLScript(language) ? listIndent : textDistanceToBullet,
      marginLeft: config.hasRTLScript(language) ? textDistanceToBullet : listIndent
    }}>
      {index})
    </Text>
  }, [language])

  // see https://github.com/archriss/react-native-render-html/issues/286
  // TODO: remove with IGAPP-378
  const renderLists = useCallback((htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { transientChildren, nodeIndex, key, listsPrefixesRenderers } = passProps
    children = children && children.map((child, index) => {
      const rawChild = transientChildren[index]
      let prefix = false
      if (rawChild && rawChild.tagName === 'li') {
        if (rawChild.parentTag === 'ul') {
          prefix = listsPrefixesRenderers.ul(htmlAttribs, children, convertedCSSStyles, { ...passProps })
        } else if (rawChild.parentTag === 'ol') {
          prefix = listsPrefixesRenderers.ol(htmlAttribs, children, convertedCSSStyles, { ...passProps, index })
        }
      }
      return config.hasRTLScript(language)
        ? (
          <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>{child}</View>
            {prefix}
          </View>
          )
        : (
          <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row' }}>
            {prefix}
            <View style={{ flex: 1 }}>{child}</View>
          </View>
          )
    })
    return <View key={key}>{children}</View>
  }, [language])

  return <SpaceBetween>
    <Container>
      <Html source={{ html: content }}
            onLinkPress={onLinkPress}
            contentWidth={width}
            defaultTextProps={{ selectable: true, allowFontStyling: true }}
            alterNode={alterResources}
            listsPrefixesRenderers={{ ul: renderUnorderedListPrefix, ol: renderOrderedListPrefix }}
            renderers={{ ul: renderLists, ol: renderLists }}
            baseFontStyle={{
              fontSize: 14,
              fontFamily: theme.fonts.native.contentFontRegular,
              color: theme.colors.textColor
            }}
            tagsStyles={{
              p: { textAlign: config.hasRTLScript(language) ? 'right' : 'left' },
              img: { align: config.hasRTLScript(language) ? 'right' : 'left' }
            }} />
      {lastUpdate &&
      <LastUpdateContainer>
        <TimeStamp formatter={formatter} lastUpdate={lastUpdate} language={language} theme={theme} />
      </LastUpdateContainer>
      }
    </Container>
  </SpaceBetween>
}

export default CategoryListContent
