import React, { ReactElement, useEffect, useState } from 'react'
import { Image, View, StyleProp, ImageStyle, ImageResizeMode, Platform } from 'react-native'
import styled from 'styled-components/native'

const StyledImage = styled.Image<{ aspectRatio?: number }>`
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
`

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

const SimpleImage = ({ source, style, resizeMode = 'contain' }: SimpleImageProps): ReactElement => {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (typeof source === 'string') {
      Image.getSize(getLocalPlatformFilepath(source), (width, height) => setAspectRatio(width / height))
    }
  }, [source])

  if (source === null) {
    return <View style={style} />
  }

  if (typeof source === 'number') {
    return <Image source={source} resizeMode={resizeMode} style={style} />
  }

  return (
    <StyledImage
      aspectRatio={aspectRatio}
      source={{ uri: getLocalPlatformFilepath(source) }}
      resizeMode={resizeMode}
      style={style}
    />
  )
}

export default SimpleImage
