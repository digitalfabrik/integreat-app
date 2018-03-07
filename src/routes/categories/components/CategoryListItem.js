import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import Highlighter from 'react-highlighter'

import CategoryModel from 'modules/endpoint/models/CategoryModel'

import style from './CategoryListItem.css'
import iconPlaceholder from '../assets/IconPlaceholder.svg'

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component {
  static propTypes = {
    category: PropTypes.instanceOf(CategoryModel).isRequired,
    children: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    /** A search query to highlight in the category title */
    query: PropTypes.string
  }

  getChildren () {
    return this.props.children.map(child =>
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
    )
  }

  getTitle () {
    return <Highlighter className={style.categoryCaption} search={this.props.query || ''}>
      {this.props.category.title}
      </Highlighter>
  }

  render () {
    const category = this.props.category
    return (
      <div className={style.row}>
        <Link href={category.url}>
          <img className={style.categoryThumbnail} src={category.thumbnail || iconPlaceholder} />
          {this.getTitle()}
        </Link>
        {this.getChildren()}
      </div>
    )
  }
}

export default CategoryListItem
