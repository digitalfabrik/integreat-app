import styled from '@emotion/styled'
import React, { ReactElement, ReactNode, useRef } from 'react'

import { TileModel } from 'shared'
import { request } from 'shared/api'

import Link from './base/Link'

const Thumbnail = styled.div`
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  padding-top: 100%;

  & img {
    position: absolute;
    top: 0;
    inset-inline: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.2s;
    object-fit: contain;
  }
`

const ThumbnailSizer = styled.div`
  width: 150px;
  max-width: 33.3vw;
  margin: 0 auto;

  & div:hover {
    ${props =>
      props.theme.isContrastTheme &&
      `
        outline: 8px solid ${props.theme.legacy.colors.themeColor};
        border-radius: 24px;
      `}
  }
`

const TileTitle = styled.div`
  margin: 5px 0;
  color: ${props => props.theme.legacy.colors.textColor};
  text-align: center;
`

const TileContainer = styled.div`
  margin-bottom: 20px;

  & > a,
  & button {
    display: block;
    max-width: 160px;
    margin: 0 auto;
    padding: 0;
    background-color: ${props => props.theme.legacy.colors.backgroundColor};
    border: none;
    box-shadow: none;
    cursor: pointer;
  }

  & img {
    filter: ${props => (props.theme.isContrastTheme ? 'invert(1) saturate(0) brightness(7)' : 'none')};
  }

  & > a:hover img,
  & button:hover img {
    transform: scale(1.01);
  }
`

type TileProps = {
  tile: TileModel
}

const Tile = ({ tile }: TileProps): ReactElement => {
  const imageRef = useRef<HTMLImageElement>(null)

  const fetchImageWithCaching = (): void => {
    if (tile.thumbnail) {
      request(tile.thumbnail, {})
        .then(res => res.blob())
        .then(blob => {
          if (imageRef.current) {
            imageRef.current.src = URL.createObjectURL(blob)
          }
        })
    }
  }

  const getTileContent = (): ReactNode => {
    fetchImageWithCaching()
    return (
      <>
        <ThumbnailSizer>
          <Thumbnail>
            <img alt='' ref={imageRef} />
          </Thumbnail>
        </ThumbnailSizer>
        <TileTitle>{tile.title}</TileTitle>
      </>
    )
  }

  return (
    <TileContainer>
      <Link to={tile.path}>{getTileContent()}</Link>
    </TileContainer>
  )
}

export default Tile
