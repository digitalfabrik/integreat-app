import React, { ReactElement, useMemo } from 'react'
import { Image, View, StyleProp, ImageStyle, ImageResizeMode, Platform } from 'react-native'
import { SvgCssUri } from 'react-native-svg'
import styled from 'styled-components/native'

const StyledImage = styled.Image<{ aspectRatio?: number }>`
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
`

export type ImageSourceType = string | number | null
type SimpleImageProps = {
  source: ImageSourceType
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
  // In order to be able to align an image, its width or aspect ratio has to be set
  specifyAspectRatio?: boolean
}

// For ios you should not use the absolute path, since it can change with a future build version, therefore we use home directory
// https://github.com/facebook/react-native/commit/23909cd6f62056de0cd0f7c06e3997dd967c139a
const getLocalPlatformFilepath = (uri: string): string => {
  if (Platform.OS === 'ios' && uri.includes('file://')) {
    return `~${uri.substring(uri.indexOf('/Documents'))}`
  }
  return uri
}

const SimpleImage = ({
  source,
  style,
  resizeMode = 'contain',
  specifyAspectRatio = false,
}: SimpleImageProps): ReactElement => {
  const aspectRatio = useMemo(() => {
    let value: undefined | number
    if (typeof source === 'string' && !source.endsWith('.svg')) {
      Image.getSize(getLocalPlatformFilepath(source), (width, height) => {
        value = width / height
      })
    }
    return value
  }, [source])

  if (source === null) {
    return <View style={style} />
  }

  if (typeof source === 'number') {
    return <Image source={source} resizeMode={resizeMode} style={style} />
  }

  if (source.endsWith('.svg')) {
    return <SvgCssUri uri={getLocalPlatformFilepath(source)} style={style} />
  }

  return (
    <StyledImage
      aspectRatio={specifyAspectRatio ? aspectRatio : undefined}
      source={{ uri: getLocalPlatformFilepath(source) }}
      resizeMode={resizeMode}
      style={style}
    />
  )
}

export default SimpleImage
