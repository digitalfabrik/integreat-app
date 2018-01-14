import React from 'react'
import PropTypes from 'prop-types'
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
      <div className={style.category}>
        <Link href={this.props.category.url}>
          <div className={style.categoryThumbnail}><img src={this.props.category.thumbnail} /></div>
          <div className={style.categoryTitle}>{this.props.category.title}</div>
        </Link>
      </div>
    )
  }
}

export default CategoryTile
