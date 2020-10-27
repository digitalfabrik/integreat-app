// @flow

import React from 'react'
import { Linking, Dimensions, View, Text } from 'react-native'
import { type DisplayMetrics } from 'react-native/Libraries/Utilities/NativeDeviceInfo'
import Html, { GestureResponderEvent, type HTMLNode, type RendererFunction } from 'react-native-render-html'
import { _constructStyles } from 'react-native-render-html/src/HTMLStyles'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { NavigateToInternalLinkParamsType } from '../../app/createNavigateToInternalLink'
import buildConfig from '../../app/constants/buildConfig'
import type { ThemeType } from '../../../../build-configs/ThemeType'
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
  navigation: NavigationStackProp<*>,
  resourceCacheUrl: string,
  navigateToInternalLink?: NavigateToInternalLinkParamsType => void,
  cacheDictionary: {[string]: string},
  language: string,
  theme: ThemeType
|}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

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
  };

  componentDidMount () {
    Dimensions.addEventListener('change', this.onChange)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.onChange)
  }

  onLinkPress = (evt: GestureResponderEvent, url: string) => {
    const { language, navigation, navigateToInternalLink } = this.props

    console.log(url)
    if (url.includes('.pdf')) {
      navigation.navigate('PDFViewModal', { url })
    } else if (url.includes('.png') || url.includes('.jpg')) {
      navigation.navigate('ImageViewModal', { url })
    } else if (navigateToInternalLink && HIJACK.test(url)) {
      navigateToInternalLink({
        url,
        language
      })
    } else {
      Linking.openURL(url).catch(err => console.error('An error occurred', err))
    }
  }

  alterResources = (node: HTMLNode) => {
    const { cacheDictionary } = this.props
    if (node.attribs && cacheDictionary) {
      if (node.attribs.href) {
        console.debug(`Found href: ${decodeURI(node.attribs.href)}`)
        const newResource = cacheDictionary[decodeURI(node.attribs.href)]
        if (newResource) {
          console.debug(`Replaced ${node.attribs.href} with ${newResource}`)
          node.attribs = { ...(node.attribs || {}), href: newResource }
          return node
        }
      } else if (node.attribs.src) {
        console.debug(`Found src: ${decodeURI(node.attribs.src)}`)
        const newResource = cacheDictionary[decodeURI(node.attribs.src)]
        if (newResource) {
          console.debug(`Replaced ${node.attribs.src} with ${newResource}`)
          node.attribs = { ...(node.attribs || {}), src: newResource }
          return node
        }
      }
    }
  }

  // see https://github.com/archriss/react-native-render-html/issues/286
  renderBulletLists: RendererFunction = (htmlAttribs, children, convertedCSSStyles, passProps) => {
    const { language, theme } = this.props
    const style = _constructStyles({
      tagName: 'ul',
      htmlAttribs,
      passProps,
      styleSet: 'VIEW'
    })
    const { allowFontScaling, rawChildren, nodeIndex, key, baseFontStyle, listsPrefixesRenderers } = passProps
    const baseFontSize = baseFontStyle.fontSize
    children = children && children.map((child, index) => {
      const rawChild = rawChildren[index]
      let prefix = false
      const rendererArgs = [
        htmlAttribs,
        children,
        convertedCSSStyles,
        {
          ...passProps,
          index
        }
      ]
      const textDistanceToBullet = 10
      const rtlListIndent = 20
      const bulletSizeRelativeToFont = 2.8
      if (rawChild) {
        if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
          prefix = listsPrefixesRenderers && listsPrefixesRenderers.ul ? listsPrefixesRenderers.ul(...rendererArgs) : (
            <View style={{
              marginRight: RTL_LANGUAGES.includes(language) ? rtlListIndent : textDistanceToBullet,
              width: baseFontSize / bulletSizeRelativeToFont,
              height: baseFontSize / bulletSizeRelativeToFont,
              marginTop: baseFontSize / 2,
              borderRadius: baseFontSize / bulletSizeRelativeToFont,
              backgroundColor: theme.colors.textColor,
              marginLeft: RTL_LANGUAGES.includes(language) ? textDistanceToBullet : 0
            }} />
          )
        } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
          prefix = listsPrefixesRenderers && listsPrefixesRenderers.ol ? listsPrefixesRenderers.ol(...rendererArgs) : (
            <Text allowFontScaling={allowFontScaling} style={{
                fontSize: baseFontSize,
                marginRight: RTL_LANGUAGES.includes(language) ? rtlListIndent : textDistanceToBullet,
                marginLeft: RTL_LANGUAGES.includes(language) ? textDistanceToBullet : 0
              }}>
              {index + 1}
            </Text>
          )
        }
      }
      return (
        RTL_LANGUAGES.includes(language) ? (
          <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>{child}</View>
            {prefix}
          </View>
        ) : (
          <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row' }}>
            {prefix}
            <View style={{ flex: 1 }}>{child}</View>
          </View>
        )

      )
    })
    return (
      <View style={style} key={key}>
        {children}
      </View>
    )
  }

  render () {
    const { content, language } = this.props
    return <VerticalPadding>
      <Html html={content}
            onLinkPress={this.onLinkPress}
            contentWidth={this.state.width}
            allowFontScaling
            textSelectable
            alterNode={this.alterResources}
            renderers={{ ul: this.renderBulletLists }}
            tagsStyles={{ p: { textAlign: RTL_LANGUAGES.includes(language) ? 'right' : 'left' } }} />
    </VerticalPadding>
  }
}

export default CategoryListContent
