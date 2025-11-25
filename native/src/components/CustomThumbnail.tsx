import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import SimpleImage from './SimpleImage'

const ThumbnailWrapper = styled.View`
  height: 180px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`

const Thumbnail = styled(SimpleImage)`
  position: absolute;
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

const CustomThumbnail = ({ src }: CustomThumbnailProps): ReactElement => (
  <ThumbnailWrapper>
    <WhiteBackground />
    <Thumbnail source={src} />
  </ThumbnailWrapper>
)

export default CustomThumbnail
