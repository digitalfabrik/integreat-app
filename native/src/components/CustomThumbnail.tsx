import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import SimpleImage from './SimpleImage'

const ThumbnailWrapper = styled.View`
  position: relative;
  height: 180px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
`

const ThumbnailBackground = styled(SimpleImage)`
  position: absolute;
  height: 100%;
  width: 100%;
`

const Thumbnail = styled(ThumbnailBackground)`
  position: relative;
`

type CustomThumbnailProps = {
  src: string
}

const CustomThumbnail = ({ src }: CustomThumbnailProps): ReactElement => {
  const theme = useTheme()
  const isNonTransparent = !src.toLowerCase().includes('.png') && !src.toLowerCase().includes('.svg')
  return (
    <ThumbnailWrapper>
      {isNonTransparent ? (
        <ThumbnailBackground source={src} resizeMode='cover' blurRadius={3} />
      ) : (
        <ThumbnailBackground style={{ tintColor: theme.colors.outline, transform: [{ scale: 1.04 }] }} source={src} />
      )}
      <Thumbnail source={src} />
    </ThumbnailWrapper>
  )
}

export default CustomThumbnail
