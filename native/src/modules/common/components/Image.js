// @flow

import * as React from 'react'

import { Image as RNImage, View } from 'react-native'
import styled from 'styled-components/native'
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

export type ImageSourceType = string | number | null

type PropsType = {|
  source: ImageSourceType,
  style?: ViewStyleProp
|}

const ThumbnailImage = styled(RNImage)`
  flex: 1;
`

const getImageSource = (uri: string | number) => (typeof uri === 'number' ? uri : { uri: uri, cache: 'reload' })

class Image extends React.Component<PropsType> {
  render() {
    const { source, style } = this.props

    if (source === null) {
      return <View style={style} />
    }

    return (
      <View>
        <ThumbnailImage source={getImageSource(source)} resizeMode={'contain'} style={style} />
      </View>
    )
  }
}

export default Image
