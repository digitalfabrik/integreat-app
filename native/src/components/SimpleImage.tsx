import React, { ReactElement } from 'react'
import { Image, View, ImageSourcePropType, StyleProp, ImageStyle, ImageResizeMode, Platform } from 'react-native'

export type ImageSourceType = string | number | null
type SimpleImageProps = {
  source: ImageSourceType
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
}
// For ios you should not use the absolute path, since it can change with a future build version, therefore we use home directory
// https://github.com/facebook/react-native/commit/23909cd6f62056de0cd0f7c06e3997dd967c139a
const getLocalFilePathForIosFiles = (uri: string) => `~${uri.substring(uri.indexOf('/Documents'))}`
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
  console.log(Platform.OS, source)

  return <Image source={getImageSource(source)} resizeMode={resizeMode} style={style} />
}

export default SimpleImage
