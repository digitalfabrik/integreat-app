import React from 'react'
import PropTypes from 'prop-types'

import style from './ContentList.css'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoryListItem from './CategoryListItem'

class ContentList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    baseUrl: PropTypes.string.isRequired
  }

  static getUrl = (baseUrl, path) => baseUrl + '/' + path

  render () {
    return (
      <div className={style.list}>
        {this.props.categories.map(category =>
          <CategoryListItem key={category.id}
                            url={ContentList.getUrl(this.props.baseUrl, category.url)}
                            category={category} />)}
      </div>
    )
  }
}

export default ContentList
