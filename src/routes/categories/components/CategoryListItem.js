// @flow

import React from 'react'
import Link from 'redux-first-router-link'
import Highlighter from 'react-highlighter'

import style from './CategoryListItem.css'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

type Props = {
  category: CategoryModel,
  children: Array<CategoryModel>,
  /** A search query to highlight in the category title */
  query?: string
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<Props> {
  getChildren () {
    return this.props.children.map(child =>
      <Link key={child.id} className={style.subRow} to={child.url}>
        {
          child.thumbnail
            ? <img src={child.thumbnail} className={style.categoryThumbnail} />
            : <div className={style.categoryThumbnail} />
        }
        <div className={style.categoryCaption}>{child.title}</div>
      </Link>
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
        <Link to={category.url}>
          <img className={style.categoryThumbnail} src={category.thumbnail || iconPlaceholder} />
          {this.getTitle()}
        </Link>
        {this.getChildren()}
      </div>
    )
  }
}

export default CategoryListItem
