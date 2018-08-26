// @flow

import * as React from 'react'
import { Col } from 'react-styled-flexboxgrid'

import styled from 'styled-components'
import TileModel from '../models/TileModel'
import CleanLink from './CleanLink'
import CleanAnchor from './CleanAnchor'

type PropsType = {
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

  & img:hover {
    transform: scale(1.01);
  }
`

const ThumbnailSizer = styled.div`
  width: 150px;
  max-width: 33.3vw;
  margin: 0 auto;
`

const TileTitle = styled.div`
  margin: 5px 0;
  text-align: center;
`

const StyledCol = styled(Col)`
  margin: 5px 0;
  text-align: center;
`

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  getTileContent (): React.Node {
    return <>
      <ThumbnailSizer>
        <Thumbnail><img src={this.props.tile.thumbnail} /></Thumbnail>
      </ThumbnailSizer>
      <TileTitle>{this.props.tile.title}</TileTitle>
    </>
  }

  getTile (): React.Node {
    const tile = this.props.tile
    if (!tile.isExternalUrl) {
      return <CleanLink to={tile.path}>{this.getTileContent()}</CleanLink>
    } else if (!tile.postData) {
      return <CleanAnchor href={tile.path} target='_blank'>{this.getTileContent()}</CleanAnchor>
    } else {
      const inputs = []
      tile.postData.forEach((value, key) => inputs.unshift(<input type='hidden' value={value} key={key} name={key} />))
      return <form method='POST' action={tile.path} target='_blank'>
        {inputs}
        <button type='submit'>{this.getTileContent()}</button>
      </form>
    }
  }

  render () {
    return (
      <StyledCol xs={6} sm={4} md={3}>
        {this.getTile()}
      </StyledCol>
    )
  }
}

export default Tile
