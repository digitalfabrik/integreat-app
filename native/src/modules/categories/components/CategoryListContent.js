// @flow

import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { type DisplayMetrics } from 'react-native/Libraries/Utilities/NativeDeviceInfo'
import Html, { GestureResponderEvent, type HTMLNode, type RendererFunction } from 'react-native-render-html'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'
import { RTL_LANGUAGES } from '../../i18n/constants'

const VerticalPadding: StyledComponent<{}, {}, *> = styled.View`
  padding: 0 20px;
`

// type inferred from 'react-native/Libraries/Utilities/Dimensions'
type DimensionsEventType = {
  window?: DisplayMetrics,
  screen?: DisplayMetrics,
  ...
}

type ContentPropsType = {|
  content: string,
  resourceCacheUrl: string,
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
  cacheDictionary: { [string]: string },
  language: string,
  theme: ThemeType
|}

const textDistanceToBullet = 10
const listIndent = 20
const bulletSizeRelativeToFont = 2.8
const bulletAlignmentRelativeToFont = 2

class CategoryListContent extends React.Component<ContentPropsType, {| width: number |}> {
  constructor () {
    super()
    this.state = {
      width: Dimensions.get('window').width
    }
  }

  onChange = (dimensionsEvent: DimensionsEventType) => {
    const defaultWidth = 200
    this.setState({ width: (dimensionsEvent.window?.width || dimensionsEvent.screen?.width || defaultWidth) })
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this.onChange)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.onChange)
  }

  onLinkPress = (evt: GestureResponderEvent, url: string) => {
    const { language, navigateToLink, cacheDictionary } = this.props
    const shareUrl = Object.keys(cacheDictionary).find(remoteUrl => cacheDictionary[remoteUrl] === url)
    navigateToLink(url, language, shareUrl || url)
  }

  alterResources = (node: HTMLNode) => {
    const { cacheDictionary } = this.props
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
  }

  // TODO: remove with IGAPP-378
  renderUnorderedListPrefix: RendererFunction = (htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { language, theme } = this.props
    const { baseFontStyle } = passProps
    const baseFontSize = baseFontStyle.fontSize
    return <View style={{
      width: baseFontSize / bulletSizeRelativeToFont,
      height: baseFontSize / bulletSizeRelativeToFont,
      borderRadius: baseFontSize / bulletSizeRelativeToFont,
      marginTop: baseFontSize / bulletAlignmentRelativeToFont,
      marginRight: RTL_LANGUAGES.includes(language) ? listIndent : textDistanceToBullet,
      marginLeft: RTL_LANGUAGES.includes(language) ? textDistanceToBullet : listIndent,
      backgroundColor: theme.colors.textColor
    }} />
  }

  // TODO: remove with IGAPP-378
  renderOrderedListPrefix: RendererFunction = (htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { baseFontSize, allowFontScaling, index } = passProps
    const { language } = this.props
    return <Text allowFontScaling={allowFontScaling} style={{
      fontSize: baseFontSize,
      marginRight: RTL_LANGUAGES.includes(language) ? listIndent : textDistanceToBullet,
      marginLeft: RTL_LANGUAGES.includes(language) ? textDistanceToBullet : listIndent
    }}>
      {index})
    </Text>
  }

  // see https://github.com/archriss/react-native-render-html/issues/286
  // TODO: remove with IGAPP-378
  renderLists: RendererFunction = (htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { language } = this.props
    const { rawChildren, nodeIndex, key, listsPrefixesRenderers } = passProps
    children = children && children.map((child, index) => {
      const rawChild = rawChildren[index]
      let prefix = false
      if (rawChild && rawChild.tagName === 'li') {
        if (rawChild.parentTag === 'ul') {
          prefix = listsPrefixesRenderers.ul(htmlAttribs, children, convertedCSSStyles, { ...passProps })
        } else if (rawChild.parentTag === 'ol') {
          prefix = listsPrefixesRenderers.ol(htmlAttribs, children, convertedCSSStyles, { ...passProps, index })
        }
      }
      return RTL_LANGUAGES.includes(language)
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
  }

  render () {
    const { content, language, theme } = this.props
    return <VerticalPadding>
      <Html html={content}
            onLinkPress={this.onLinkPress}
            contentWidth={this.state.width}
            allowFontScaling
            textSelectable
            alterNode={this.alterResources}
            listsPrefixesRenderers={{ ul: this.renderUnorderedListPrefix, ol: this.renderOrderedListPrefix }}
            renderers={{ ul: this.renderLists, ol: this.renderLists }}
            baseFontStyle={{
              fontSize: 14,
              fontFamily: theme.fonts.contentFontRegular,
              color: theme.colors.textColor
            }}
            tagsStyles={{
              p: { textAlign: RTL_LANGUAGES.includes(language) ? 'right' : 'left' },
              img: { align: RTL_LANGUAGES.includes(language) ? 'right' : 'left' }
            }} />
    </VerticalPadding>
  }
}

export default CategoryListContent
