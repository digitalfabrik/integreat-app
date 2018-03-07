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
    categories: PropTypes.arrayOf(PropTypes.shape({
      model: PropTypes.instanceOf(CategoryModel).isRequired,
      children: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
    })).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    /** A search query to highlight in the categories titles */
    query: PropTypes.string
  }

  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <RemoteContent centered dangerouslySetInnerHTML={{__html: this.props.content}} />
        <div className={style.list}>
          {this.props.categories.map(({model, children}) =>
            <CategoryListItem key={model.id}
                              category={model}
                              children={children}
                              query={this.props.query} />)}
        </div>
      </div>
    )
  }
}

export default CategoryList
