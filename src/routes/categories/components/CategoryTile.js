// @flow

import React from 'react'
import { Link } from 'redux-little-router'
import { Col } from 'react-flexbox-grid'

import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

import style from './CategoryTile.css'

type Props = {
  category: CategoryModel
}

/**
 * Displays a single CategoryTile
 */
class CategoryTile extends React.Component<Props> {
  render () {
    return (
      <Col xs={6} sm={4} md={3} className={style.category}>
        <Link href={this.props.category.url}>
          <div className={style.thumbnailSizer}>
            <div className={style.categoryThumbnail}>
              <img src={this.props.category.thumbnail} />
            </div>
          </div>
          <div className={style.categoryTitle}>{this.props.category.title}</div>
        </Link>
      </Col>
    )
  }
}

export default CategoryTile
