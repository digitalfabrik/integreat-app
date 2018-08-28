// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import Link from 'redux-first-router-link'
import { Col } from 'react-styled-flexboxgrid'

import style from './Tile.css'
import TileModel from '../models/TileModel'

type PropsType = {
  tile: TileModel
}

/**
 * Displays a single Tile
 */
class Tile extends React.Component<PropsType> {
  static propTypes = {
    tile: PropTypes.instanceOf(TileModel).isRequired
  }

  getTileContent (): React.Node {
    return <React.Fragment>
      <div className={style.thumbnailSizer}>
        <div className={style.thumbnail}>
          <img src={this.props.tile.thumbnail} />
        </div>
      </div>
      <div className={style.title}>{this.props.tile.title}</div>
    </React.Fragment>
  }

  getTile (): React.Node {
    const tile = this.props.tile
    return tile.isExternalUrl
      ? <a href={this.props.tile.path} target='_blank'>
        {this.getTileContent()}
      </a>
      : <Link to={this.props.tile.path}>
        {this.getTileContent()}
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
