// @flow

import * as React from 'react'
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
    if (!tile.isExternalUrl) {
      return <Link to={tile.path}>
        {this.getTileContent()}
      </Link>
    } else if (!tile.postData) {
      return <a href={tile.path} target='_blank'>
        {this.getTileContent()}
      </a>
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
      <Col xs={6} sm={4} md={3} className={style.tile}>
        {this.getTile()}
      </Col>
    )
  }
}

export default Tile
