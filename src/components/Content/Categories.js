import React from 'react'
import PropTypes from 'prop-types'

import style from './Categories.css'

import { Link } from 'react-router-dom'
import { Col, Row } from 'react-flexbox-grid'
import PageModel from 'endpoints/models/PageModel'
import { map } from 'lodash/collection'
import PDFButton from './PDFButton'

class Category extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link to={this.props.url}>
          <img className={style.thumbnail} src={this.props.page.thumbnail}/>
          <div className={style.caption}>{this.props.page.title}</div>
        </Link>
      </Col>
    )
  }
}

export default class Categories extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    children: PropTypes.object.isRequired
  }

  render () {
    return (
      <div>
        <Row>
          {
            map(this.props.children, (page, url) => {
              return <Category key={page.id} url={url} page={page}/>
            })
          }
        </Row>
        <PDFButton requestType="allpages" parentPage={this.props.parentPage} pages={[]}/>
      </div>
    )
  }
}
