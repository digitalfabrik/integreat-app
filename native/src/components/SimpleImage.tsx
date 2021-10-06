import React, { ReactElement } from 'react'
import { Image, View, ImageSourcePropType, StyleProp, ImageStyle } from 'react-native'

export type ImageSourceType = string | number | null
type PropsType = {
  source: ImageSourceType
  style?: StyleProp<ImageStyle>
}

const getImageSource = (uri: string | number): ImageSourcePropType =>
  typeof uri === 'number'
    ? uri
    : {
        uri,
        cache: 'reload'
      }

const SimpleImage = ({ source, style }: PropsType): ReactElement => {
  if (source === null) {
    return <View style={style} />
  }

  return <Image source={getImageSource(source)} resizeMode='contain' style={style} />
}

export default SimpleImage
