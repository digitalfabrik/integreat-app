// @flow

import * as React from 'react'

import { View } from 'react-native'
import styled from 'styled-components/native'
import FastImage from 'react-native-fast-image'
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

export type ImageSourceType = string | number | null

type PropsType = {|
  source: ImageSourceType,
  style?: ViewStyleProp
|}

const ThumbnailImage = styled(FastImage)`
  flex: 1;
`

const getFastImageSource = (uri: string | number) =>
  typeof uri === 'number'
    ? uri
    : {
        uri: uri,
        priority: FastImage.priority.normal,
        // disable caching, we want to do it manually
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        cache: FastImage.cacheControl.web
      }

class Image extends React.Component<PropsType> {
  render() {
    const { source, style } = this.props

    if (source === null) {
      return <View style={style} />
    }

    return (
      <View style={style}>
        <ThumbnailImage source={getFastImageSource(source)} resizeMode={FastImage.resizeMode.contain} />
      </View>
    )
  }
}

export default Image
