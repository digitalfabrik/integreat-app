import React from 'react'
import PropTypes from 'prop-types'

import style from './Categories.css'

import { Col, Row } from 'react-flexbox-grid'
import PageModel from 'endpoints/models/PageModel'
import { map } from 'lodash/collection'
import PDFButton from './PDFButton'
import { Link } from 'redux-little-router'

class Category extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link href={this.props.url}>
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
    categories: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return (
      <div>
        <Row>
          { map(this.props.categories, ({ page, url }) => <Category key={page.id} url={url} page={page} />) }
        </Row>
        <PDFButton requestType="allpages" parentPage={this.props.parentPage} pages={[]}/>
      </div>
    )
  }
}
