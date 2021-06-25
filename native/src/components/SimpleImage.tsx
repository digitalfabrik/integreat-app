import * as React from 'react'
import { ReactNode } from 'react'
import { Image, View, ImageSourcePropType } from 'react-native'
import { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

export type ImageSourceType = string | number | null
type PropsType = {
  source: ImageSourceType
  style?: ViewStyleProp
}

const getImageSource = (uri: string | number): ImageSourcePropType =>
  typeof uri === 'number'
    ? uri
    : {
        uri: uri,
        cache: 'reload'
      }

class SimpleImage extends React.Component<PropsType> {
  render(): ReactNode {
    const { source, style } = this.props

    if (source === null) {
      return <View style={style} />
    }

    return <Image source={getImageSource(source)} resizeMode='contain' style={style} />
  }
}

export default SimpleImage
