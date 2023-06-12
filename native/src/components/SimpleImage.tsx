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
const getLocalPlatformFilepath = (uri: string): string => {
  if (Platform.OS === 'ios' && uri.includes('file://')) {
    return `~${uri.substring(uri.indexOf('/Documents'))}`
  }
  return uri
}
const getImageSource = (uri: string | number): ImageSourcePropType =>
  typeof uri === 'number'
    ? uri
    : {
        uri: getLocalPlatformFilepath(uri),
      }

const SimpleImage = ({ source, style, resizeMode = 'contain' }: SimpleImageProps): ReactElement => {
  if (source === null) {
    return <View style={style} />
  }

  return <Image source={getImageSource(source)} resizeMode={resizeMode} style={style} />
}

export default SimpleImage
