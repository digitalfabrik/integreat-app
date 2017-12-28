import React from 'react'
import PropTypes from 'prop-types'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import RemoteContent from 'modules/common/components/RemoteContent'

import ContentList from './ContentList'

import style from './CategoryList.css'

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component {
  static propTypes = {
    parentCategory: PropTypes.instanceOf(CategoryModel).isRequired,
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
  }

  render () {
    return (
      <div>
        <div className={style.horizontalLine}>
          <div className={style.heading}>
            <img className={style.headingImage} src={this.props.parentCategory.thumbnail} />
            <div className={style.headingText}>{this.props.parentCategory.title}</div>
            <RemoteContent className={style.shortText}
                           dangerouslySetInnerHTML={{__html: this.props.parentCategory.content}} />
          </div>
        </div>
        <ContentList categories={this.props.categories} />
      </div>
    )
  }
}

export default CategoryList
