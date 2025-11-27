import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const ThumbnailWrapper = styled('div')`
  position: relative;
  height: clamp(120px, 14vh, 160px);
  width: fit-content;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  ${props => props.theme.breakpoints.down('md')} {
    order: 1;
    margin-top: 12px;
  }
`

const Thumbnail = styled('img')`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: contain;
`

const WhiteBackground = styled('div')`
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
    <Thumbnail alt='' src={src} />
  </ThumbnailWrapper>
)

export default CustomThumbnail
