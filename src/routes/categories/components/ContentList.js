import React from 'react'
import PropTypes from 'prop-types'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoryListItem from './CategoryListItem'

import style from './ContentList.css'

/**
 * Displays a list of categories
 */
class ContentList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
  }

  render () {
    return (
      <div className={style.list}>
        {this.props.categories.map(category =>
          <CategoryListItem key={category.id}
                            category={category} />)}
      </div>
    )
  }
}

export default ContentList
