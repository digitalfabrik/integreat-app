import React, { ReactNode } from 'react'
import styled from 'styled-components'

import TileModel from '../models/TileModel'
import CleanLink from './CleanLink'
import Thumbnail from './Thumbnail'

type TileProps = {
  tile: TileModel
}

const StyledThumbnail = styled(Thumbnail)`
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
class Tile extends React.PureComponent<TileProps> {
  getTileContent(): ReactNode {
    const { tile } = this.props
    return (
      <>
        <StyledThumbnail src={tile.thumbnail} />
        <TileTitle>{tile.title}</TileTitle>
      </>
    )
  }

  getTile(): ReactNode {
    const { tile } = this.props
    if (!tile.postData) {
      return <CleanLink to={tile.path}>{this.getTileContent()}</CleanLink>
    }
    const inputs: ReactNode[] = []
    // tile.postData is not an array so key is actually a string with the name of the post data field
    // eslint-disable-next-line react/no-array-index-key
    tile.postData.forEach((value, key) => inputs.unshift(<input type='hidden' value={value} key={key} name={key} />))
    return (
      <form method='POST' action={tile.path}>
        {inputs}
        <button type='submit' role='link'>
          {this.getTileContent()}
        </button>
      </form>
    )
  }

  render(): ReactNode {
    return <TileContainer>{this.getTile()}</TileContainer>
  }
}

export default Tile
