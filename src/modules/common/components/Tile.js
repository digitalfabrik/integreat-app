import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import { Col } from 'react-flexbox-grid'

import style from './Tile.css'
import TileModel from '../models/TileModel'

/**
 * Displays a single Tile
 */
class Tile extends React.Component {
  static propTypes = {
    tile: PropTypes.instanceOf(TileModel).isRequired
  }

  getTile () {
    const tile = this.props.tile
    return tile.isExternalUrl
      ? <a href={this.props.tile.path}>
        <div className={style.thumbnailSizer}>
          <div className={style.thumbnail}>
            <img src={this.props.tile.thumbnail} />
          </div>
        </div>
        <div className={style.title}>{this.props.tile.name}</div>
      </a>
      : <Link href={this.props.tile.path}>
        <div className={style.thumbnailSizer}>
          <div className={style.thumbnail}>
            <img src={this.props.tile.thumbnail} />
          </div>
        </div>
        <div className={style.title}>{this.props.tile.name}</div>
      </Link>
  }

  render () {
    return (
      <Col xs={6} sm={4} md={3} className={style.tile}>
        {this.getTile()}
      </Col>
    )
  }
}

export default Tile
