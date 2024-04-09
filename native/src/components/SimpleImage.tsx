import React, { JSXElementConstructor, ReactElement, useMemo } from 'react'
import { Image, View, StyleProp, ImageStyle, ImageResizeMode } from 'react-native'
import { SvgCssUri, SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { PageResourceCacheStateType } from '../utils/DataContainer'
import getCachedThumbnail from '../utils/getCachedThumbnail'
import Icon from './base/Icon'

const StyledImage = styled.Image<{ aspectRatio?: number }>`
  ${props => props.aspectRatio !== undefined && `aspect-ratio: ${props.aspectRatio};`}
`

type AspectRatioImageProps = {
  source: string
  resizeMode: ImageResizeMode
  specifyAspectRatio: boolean
  style?: StyleProp<ImageStyle>
}

const AspectRatioImage = ({ source, style, resizeMode, specifyAspectRatio }: AspectRatioImageProps) => {
  const aspectRatio = useMemo(() => {
    let value: undefined | number
    Image.getSize(source, (width, height) => {
      value = width / height
    })
    return value
  }, [source])

  return (
    <StyledImage
      aspectRatio={specifyAspectRatio ? aspectRatio : undefined}
      source={{ uri: source }}
      resizeMode={resizeMode}
      style={style}
    />
  )
}

export type ImageSourceType = JSXElementConstructor<SvgProps> | string | number | null
type SimpleImageProps = {
  source: ImageSourceType
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
  // In order to be able to align an image, its width or aspect ratio has to be set
  specifyAspectRatio?: boolean
  resourceCache?: PageResourceCacheStateType
}

const SimpleImage = ({
  source,
  style,
  resizeMode = 'contain',
  specifyAspectRatio = false,
  resourceCache,
}: SimpleImageProps): ReactElement => {
  if (source === null) {
    return <View style={style} />
  }

  if (typeof source === 'number') {
    return <Image source={source} resizeMode={resizeMode} style={style} />
  }

  const isSvgIcon = typeof source === 'function'
  if (isSvgIcon) {
    // @ts-expect-error style types are not compatible
    return <Icon Icon={source} style={style} />
  }

  const cachedSource = getCachedThumbnail(source, resourceCache)

  if (cachedSource.endsWith('.svg')) {
    return <SvgCssUri uri={cachedSource} style={style} />
  }

  return (
    <AspectRatioImage
      source={cachedSource}
      resizeMode={resizeMode}
      style={style}
      specifyAspectRatio={specifyAspectRatio}
    />
  )
}

export default SimpleImage
