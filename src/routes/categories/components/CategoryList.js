// @flow

import React from 'react'

import RemoteContent from 'modules/common/components/RemoteContent'
import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'

import style from './CategoryList.css'
import type { CategoryType } from '../../../modules/endpoint/models/CategoryModel'

type Props = {
  categories: Array<{model: CategoryType, children: Array<CategoryType>}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<Props> {
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
