import React from 'react'
import PropTypes from 'prop-types'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import RemoteContent from 'modules/common/components/RemoteContent'

import style from './CategoryList.css'
import Caption from '../../../modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    title: PropTypes.string,
    content: PropTypes.string
  }

  // todo refactor design, will be done in WEBAPP-97
  render () {
    return (
      <div>
        {this.props.title ? <Caption title={this.props.title} /> : null}
        <RemoteContent isCentered dangerouslySetInnerHTML={{__html: this.props.content}} />
        <div className={style.list}>
          {this.props.categories.map(category =>
            <CategoryListItem key={category.id}
                              category={category} />)}
        </div>
      </div>
    )
  }
}

export default CategoryList
