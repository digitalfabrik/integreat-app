import React from 'react'
import PropTypes from 'prop-types'

import style from './CategoriesTable.css'

import { Col, Row } from 'react-flexbox-grid'
import PageModel from 'endpoints/models/PageModel'
import { Link } from 'redux-little-router'

class FirstOrderCategory extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link href={this.props.url}>
          <img className={style.categoryThumbnail} src={this.props.page.thumbnail}/>
          <div className={style.categoryCaption}>{this.props.page.title}</div>
        </Link>
      </Col>
    )
  }
}

class CategoriesTable extends React.Component {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    return <Row>
      {this.props.pages.map(({page, url}) => <FirstOrderCategory key={page.id} url={url} page={page}/>)}
    </Row>
  }
}

export default CategoriesTable
