import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const ThumbnailWrapper = styled('div')`
  position: relative;
  height: clamp(120px, 14vh, 160px);
  width: 100%;
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
const ThumbnailBackground = styled(Thumbnail)`
  position: absolute;
  object-fit: cover;
  filter: blur(10px);
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

const CustomThumbnail = ({ src }: CustomThumbnailProps): ReactElement => {
  const opaque = ['.jpg', '.jpeg'].some(extension => src.toLowerCase().includes(extension))
  return (
    <ThumbnailWrapper>
      {opaque ? <ThumbnailBackground alt='' src={src} /> : <WhiteBackground />}
      <Thumbnail alt='' src={src} />
    </ThumbnailWrapper>
  )
}

export default CustomThumbnail
