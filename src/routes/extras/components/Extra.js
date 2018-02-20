import React from 'react'
import PropTypes from 'prop-types'

import ExtraModel from 'modules/endpoint/models/ExtraModel'

import PlaceholderIcon from 'routes/categories/assets/IconPlaceholder.svg'
import style from './Extra.css'
import { Col } from 'react-flexbox-grid'

export default class Extra extends React.Component {
  static propTypes = {
    extra: PropTypes.instanceOf(ExtraModel).isRequired
  }

  render () {
    const extra = this.props.extra

    return <Col xs={6} sm={4} md={3} className={style.extra}>
      <a href={extra.url}>
        <img className={style.thumbnail} src={extra.thumbnail || PlaceholderIcon} />
        <div className={style.title}>{extra.name}</div>
      </a>
    </Col>
  }
}
