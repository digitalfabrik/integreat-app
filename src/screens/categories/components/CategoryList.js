// @flow

import * as React from 'react'

import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import HTML from 'react-native-render-html'
import type { ThemeType } from '../../../modules/layout/constants/theme'

type PropsType = {
  categories: Array<{| model: CategoryModel, subCategories: Array<CategoryModel> |}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: CategoryModel) => void
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<PropsType> {
  render () {
    const {categories, title, content, query} = this.props
    return (
      <>
        {title && <Caption title={title} />}
        {!!content &&
        <HTML html={content} />
        }
        <>
          {categories.map(({model, subCategories}) =>
            <CategoryListItem key={model.id}
                              category={model}
                              subCategories={subCategories}
                              query={query}
                              theme={this.props.theme}
                              onItemPress={this.props.onItemPress} />
          )}
        </>
      </>
    )
  }
}

export default CategoryList
