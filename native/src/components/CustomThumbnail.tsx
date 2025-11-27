import React, { ReactElement, useState, useEffect } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import SimpleImage from './SimpleImage'

const MAX_SIZE = 180

const ThumbnailWrapper = styled.View<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 8px;
  overflow: hidden;
  align-self: flex-start;
`

const Thumbnail = styled(SimpleImage)`
  height: 100%;
  width: 100%;
`

const WhiteBackground = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #fff;
`

type CustomThumbnailProps = {
  src: string
}

const CustomThumbnail = ({ src }: CustomThumbnailProps): ReactElement => {
  const [dimensions, setDimensions] = useState({ width: MAX_SIZE, height: MAX_SIZE })

  useEffect(() => {
    Image.getSize(src, (width, height) => {
      const aspectRatio = width / height
      const calculatedHeight = MAX_SIZE / aspectRatio
      setDimensions({
        width: MAX_SIZE,
        height: Math.min(calculatedHeight, MAX_SIZE),
      })
    })
  }, [src])

  return (
    <ThumbnailWrapper width={dimensions.width} height={dimensions.height}>
      <WhiteBackground />
      <Thumbnail source={src} resizeMode='contain' />
    </ThumbnailWrapper>
  )
}

export default CustomThumbnail
