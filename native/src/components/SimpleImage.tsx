import React, { ReactElement } from 'react'
import { Image, View, ImageSourcePropType, StyleProp, ImageStyle, ImageResizeMode } from 'react-native'

export type ImageSourceType = string | number | null
type SimpleImageProps = {
  source: ImageSourceType
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
}

const getImageSource = (uri: string | number): ImageSourcePropType =>
  typeof uri === 'number'
    ? uri
    : {
        uri,
        cache: 'reload',
      }

const SimpleImage = ({ source, style, resizeMode = 'contain' }: SimpleImageProps): ReactElement => {
  if (source === null) {
    return <View style={style} />
  }

  return <Image source={getImageSource(source)} resizeMode={resizeMode} style={style} />
}

export default SimpleImage
