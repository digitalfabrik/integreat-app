// @flow

import React from 'react'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'
import { Row } from 'react-styled-flexboxgrid'

import style from './Tiles.css'
import TileModel from '../models/TileModel'

type PropsType = {
  title: ?string,
  tiles: TileModel[]
}

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component<PropsType> {
  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <Row className={style.tiles}>
          {this.props.tiles.map(tile =>
            <Tile key={tile.id} tile={tile} />)}
        </Row>
      </div>
    )
  }
}

export default Tiles
