import React from 'react'
import PropTypes from 'prop-types'

import ExtraModel from 'modules/endpoint/models/ExtraModel'

import style from './Extra.css'
import { Col } from 'react-flexbox-grid'
import { Link } from 'redux-little-router'

export default class Extra extends React.Component {
  static propTypes = {
    extra: PropTypes.instanceOf(ExtraModel).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  getSprungbrettUrl () {
    return `/${this.props.location}/${this.props.language}/extras/sprungbrett`
  }

  getExtra () {
    const extra = this.props.extra
    return extra.type === 'ige-sbt'
      ? <Link href={this.getSprungbrettUrl()}>
        <img className={style.thumbnail} src={extra.thumbnail} />
        <div className={style.title}>{extra.name}</div>
      </Link>
      : <a href={extra.url}>
      <img className={style.thumbnail} src={extra.thumbnail} />
      <div className={style.title}>{extra.name}</div>
    </a>
  }

  render () {
    return <Col xs={6} sm={4} md={3} className={style.extra}>
      {this.getExtra()}
    </Col>
  }
}
