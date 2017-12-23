import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import style from './CategoryListItem.css'

import IconPlaceholder from '../assets/IconPlaceholder.svg'
import PageModel from 'modules/endpoint/models/CategoryModel'

class CategoryListItem extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    return (
      <Link href={this.props.url}>
        <div className={style.row}>
          <img className={style.categoryThumbnail} src={this.props.page.thumbnail || IconPlaceholder}/>
          <div className={style.categoryCaption}>{this.props.page.title}</div>
        </div>
      </Link>
    )
  }
}

export default CategoryListItem
