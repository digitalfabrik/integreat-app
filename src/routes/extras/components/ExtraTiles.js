import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-flexbox-grid'

import ExtraModel from 'modules/endpoint/models/ExtraModel'
import Extra from './Extra'

import style from './ExtraTiles.css'

class ExtraTiles extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <Row className={style.extraTiles}>
          {this.props.extras.map(extra =>
            <Extra key={extra.type} location={this.props.location} language={this.props.language} extra={extra} />
          )}
        </Row>
      </div>
    )
  }
}

export default ExtraTiles
