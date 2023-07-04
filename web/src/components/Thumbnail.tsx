import React, { ReactElement } from 'react'
import styled from 'styled-components'

const ThumbnailBox = styled.div<{ squared: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  ${props => props.squared && 'padding-top: 100%;'}

  & img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    ${props => props.squared && 'height: 100%;'}
    transition: transform 0.2s;
    object-fit: contain;
  }
`

const ThumbnailSizer = styled.div`
  width: 150px;
  max-width: 33.3vw;
`

type ThumbnailProps = {
  src: string
  squared?: boolean
}

const Thumbnail = ({ src, squared = true }: ThumbnailProps): ReactElement => (
  <ThumbnailSizer>
    <ThumbnailBox squared={squared}>
      <img alt='' src={src} />
    </ThumbnailBox>
  </ThumbnailSizer>
)

export default Thumbnail
