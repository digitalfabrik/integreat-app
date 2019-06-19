// @flow

import * as React from 'react'

import { View } from 'react-native'
import styled from 'styled-components/native'
import FastImage from 'react-native-fast-image'
import getFastImageSource from '../getFastImageSource'
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

type PropsType = {
  uri: string | number | null,
  style?: ViewStyleProp
}

const ThumbnailImage = styled(FastImage)`
  flex: 1;
`

class Thumbnail extends React.Component<PropsType> {
  render () {
    const {uri, style} = this.props

    if (uri === null) {
      return <View style={style} />
    }

    return <View style={style}>
      <ThumbnailImage source={getFastImageSource(uri)} resizeMode={FastImage.resizeMode.contain} />
    </View>
  }
}

export default Thumbnail
