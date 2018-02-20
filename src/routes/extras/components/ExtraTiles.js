import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import Extra from './Extra'

import style from './ExtraTiles.css'
import SprungbrettExtra from './SprungbrettExtra'

class ExtraTiles extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired
  }

  getExtras () {
    return this.props.extras.map(extra => (
      extra.type === 'ige-sbt' ? <SprungbrettExtra extra={extra} /> : <Extra extra={extra} />)
    )
  }

  render () {
    return (
      <div>
        <Row className={style.extraTiles}>
          {this.getExtras()}
        </Row>
      </div>
    )
  }
}

export default ExtraTiles
