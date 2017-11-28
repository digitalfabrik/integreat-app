import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-flexbox-grid'
import { Link } from 'redux-little-router'

import PageModel from 'endpoints/models/PageModel'
import LOCATIONS_ENDPOINT from 'endpoints/location'
import withFetcher from 'endpoints/withFetcher'
import Caption from './Caption'

import style from './TitledCategoriesTable.css'

class Category extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link href={this.props.url}>
          <img className={style.categoryThumbnail} src={this.props.page.thumbnail}/>
          <div className={style.categoryTitle}>{this.props.page.title}</div>
        </Link>
      </Col>
    )
  }
}

class TitledCategoriesTable extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  getTitle () {
    return this.props.locations.find((location) => location.code === this.props.parentPage.title).name
  }

  render () {
    return (
      <div>
        <Caption title={this.getTitle()}/>
        <Row>
          {this.props.pages.map(({page, url}) => <Category key={page.id} url={url} page={page}/>)}
        </Row>
      </div>
    )
  }
}

export default withFetcher(LOCATIONS_ENDPOINT, true, true)(TitledCategoriesTable)
