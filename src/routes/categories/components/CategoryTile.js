import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'react-flexbox-grid'
import { Link } from 'redux-little-router'
import style from './CategoryTile.css'
import PageModel from 'modules/endpoint/models/PageModel'

class CategoryTile extends React.Component {
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

export default CategoryTile
