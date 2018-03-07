import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import Tile from './Tile'
import { Row } from 'react-flexbox-grid'

import style from './Tiles.css'
import TileModel from '../models/TileModel'

/**
 * Displays a table of Tiles
 */
class Tiles extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    tiles: PropTypes.arrayOf(PropTypes.instanceOf(TileModel)).isRequired
  }

  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <Row className={style.tiles}>
          {this.props.tiles.map(tile =>
            <Tile key={tile.id}
                  tile={tile} />)}
        </Row>
      </div>
    )
  }
}

export default Tiles
