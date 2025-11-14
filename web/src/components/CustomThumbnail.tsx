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

const Thumbnail = styled('img')<{ isPng?: boolean }>`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: contain;
  ${props =>
    props.isPng &&
    props.theme.isContrastTheme &&
    `
   filter: drop-shadow(0 0 5px ${props.theme.palette.text.primary}) drop-shadow(0 0 5px ${props.theme.palette.text.primary});
  `}
`
const ThumbnailBackground = styled(Thumbnail)`
  position: absolute;
  object-fit: cover;
  filter: blur(10px);
`

type CustomThumbnailProps = {
  src: string
}

const CustomThumbnail = ({ src }: CustomThumbnailProps): ReactElement => {
  const isNonTransparent = !src.toLowerCase().includes('.png') && !src.toLowerCase().includes('.svg')
  return (
    <ThumbnailWrapper>
      {isNonTransparent && <ThumbnailBackground alt='' src={src} />}
      <Thumbnail isPng={!isNonTransparent} alt='' src={src} />
    </ThumbnailWrapper>
  )
}

export default CustomThumbnail
