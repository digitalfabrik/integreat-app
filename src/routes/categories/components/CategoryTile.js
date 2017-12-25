import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'react-flexbox-grid'
import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'

import style from './CategoryTile.css'

/**
 * Displays a single CategoryTile
 */
class CategoryTile extends React.Component {
  static propTypes = {
    category: PropTypes.instanceOf(CategoryModel).isRequired
  }

  render () {
    return (
      <Col xs={6} sm={4} className={style.category}>
        <Link href={this.props.category.url}>
          <img className={style.categoryThumbnail} src={this.props.category.thumbnail} />
          <div className={style.categoryTitle}>{this.props.category.title}</div>
        </Link>
      </Col>
    )
  }
}

export default CategoryTile
