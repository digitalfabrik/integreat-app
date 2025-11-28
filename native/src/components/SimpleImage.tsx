import React, { JSXElementConstructor, ReactElement, useMemo } from 'react'
import { Image, View, StyleProp, ImageStyle, ImageResizeMode, StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { SvgCssUri } from 'react-native-svg/css'
import styled from 'styled-components/native'

import useResourceCache from '../hooks/useResourceCache'
import { getCachedResource } from '../utils/helpers'
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
      role='img'
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
}

const SimpleImage = ({
  source,
  style,
  resizeMode = 'contain',
  specifyAspectRatio = false,
}: SimpleImageProps): ReactElement => {
  const { data: resourceCache } = useResourceCache()

  if (source === null) {
    return <View style={style} />
  }

  if (typeof source === 'number') {
    return <Image source={source} resizeMode={resizeMode} style={style} accessibilityIgnoresInvertColors role='img' />
  }

  const isSvgIcon = typeof source === 'function'
  if (isSvgIcon) {
    // @ts-expect-error style types are not compatible
    return <Icon Icon={source} style={style} />
  }

  const cachedSource = getCachedResource(source, { resourceCache })

  if (cachedSource.endsWith('.svg')) {
    // SvgCssUri doesn't use the width and height in the style prop
    const flattenedStyle = StyleSheet.flatten(style)
    const { width, height } = flattenedStyle
    const widthFromStyleObject = typeof width === 'number' || typeof width === 'string' ? width : undefined
    const heightFromStyleObject = typeof height === 'number' || typeof height === 'string' ? height : undefined
    return <SvgCssUri uri={cachedSource} style={style} width={widthFromStyleObject} height={heightFromStyleObject} />
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
