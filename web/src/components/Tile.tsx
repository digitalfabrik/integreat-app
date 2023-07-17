import React, { ReactElement, ReactNode, useRef } from 'react'
import styled from 'styled-components'

import { request } from 'api-client/src/request'

import TileModel from '../models/TileModel'
import CleanLink from './CleanLink'

type TileProps = {
  tile: TileModel
}

const Thumbnail = styled.div`
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
  margin: 0 auto;
`

const TileTitle = styled.div`
  margin: 5px 0;
  color: ${props => props.theme.colors.textColor};
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
    background-color: ${props => props.theme.colors.backgroundColor};
    border: none;
    box-shadow: none;
    cursor: pointer;
  }

  & > a:hover img,
  & button:hover img {
    transform: scale(1.01);
  }
`

/**
 * Displays a single Tile
 */
const Tile = (props: TileProps): ReactElement => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { tile } = props

  const fetchImageWithCaching = (): void => {
    request(tile.thumbnail, {})
      .then(res => res.blob())
      .then(blob => {
        if (imageRef.current) {
          imageRef.current.src = URL.createObjectURL(blob)
        }
      })
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

  const getTile = (): ReactNode => {
    const { tile } = props
    if (!tile.postData) {
      return <CleanLink to={tile.path}>{getTileContent()}</CleanLink>
    }
    const inputs: ReactNode[] = []
    // tile.postData is not an array so key is actually a string with the name of the post data field
    // eslint-disable-next-line react/no-array-index-key
    tile.postData.forEach((value, key) => inputs.unshift(<input type='hidden' value={value} key={key} name={key} />))
    return (
      <form method='POST' action={tile.path}>
        {inputs}
        <button type='submit' role='link'>
          {getTileContent()}
        </button>
      </form>
    )
  }

  return <TileContainer>{getTile()}</TileContainer>
}

export default Tile
