import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import CategoryModel from 'modules/endpoint/models/CategoryModel'

import style from './CategoryListItem.css'
import iconPlaceholder from '../assets/IconPlaceholder.svg'

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component {
  static propTypes = {
    category: PropTypes.instanceOf(CategoryModel).isRequired,
    children: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
  }

  render () {
    const {category, children} = this.props
    return (
      <div className={style.row}>
        <Link href={category.url}>
          <img className={style.categoryThumbnail} src={category.thumbnail || iconPlaceholder} />
          <div className={style.categoryCaption}>{category.title}</div>
        </Link>
        {children.map(child =>
          <div key={child.id} className={style.subRow}>
            <Link href={child.url}>
              {
                child.thumbnail
                ? <img src={child.thumbnail} className={style.categoryThumbnail} />
                : <div className={style.categoryThumbnail} />
              }
              <div className={style.categoryCaption}>{child.title}</div>
            </Link>
          </div>
        )}
      </div>
    )
  }
}

export default CategoryListItem
