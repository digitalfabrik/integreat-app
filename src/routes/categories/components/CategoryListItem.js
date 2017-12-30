import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'

import style from './CategoryListItem.css'
import IconPlaceholder from '../assets/IconPlaceholder.svg'

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component {
  static propTypes = {
    category: PropTypes.instanceOf(CategoryModel).isRequired
  }

  render () {
    return (
      <Link href={this.props.category.url}>
        <div className={style.row}>
          <img className={style.categoryThumbnail} src={this.props.category.thumbnail || IconPlaceholder} />
          <div className={style.categoryCaption}>{this.props.category.title}</div>
        </div>
      </Link>
    )
  }
}

export default CategoryListItem
