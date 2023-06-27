import React, { ReactElement } from 'react'
import styled from 'styled-components'

const ThumbnailBox = styled.div`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  padding-top: 100%;

  & img {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
}

const Thumbnail = ({ src }: ThumbnailProps): ReactElement => (
  <ThumbnailSizer>
    <ThumbnailBox>
      <img alt='' src={src} />
    </ThumbnailBox>
  </ThumbnailSizer>
)

export default Thumbnail
