import React from 'react'
import PropTypes from 'prop-types'
import { values } from 'lodash/object'

import style from './Categories.css'
import helper from '../Helper/Helper.css'

import { Link } from 'react-router-dom'
import { PageModel } from '../../src/endpoints/page'
import { Col, Row } from 'react-flexbox-grid'

class Category extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link className={helper.removeA} to={this.props.url + '/' + this.props.page.id}>
          <img className={style.thumbnail} src={this.props.page.thumbnail}/>
          <div className={style.caption}>{this.props.page.title}</div>
        </Link>
      </Col>
    )
  }
}

export default class Categories extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Row>
        {
          values(this.props.page.children).map(page => {
            return <Category key={page.id} url={this.props.url} page={page}/>
          })
        }
      </Row>
    )
  }
}
