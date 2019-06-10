// @flow

import * as React from 'react'

import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import HTML from 'react-native-render-html'
import type { ThemeType } from 'modules/theme/constants/theme'

type PropsType = {
  categories: Array<{|
    model: { title: string, thumbnail: string, path: string },
    subCategories: Array<{ title: string, thumbnail: string, path: string }>
  |}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<PropsType> {
  render () {
    const {categories, title, content, query, theme, onItemPress} = this.props
    return <>
      {title && <Caption title={title} theme={theme} />}
      {!!content && <HTML html={content} />}
      {categories.map(({model, subCategories}) =>
        <CategoryListItem key={model.path}
                          category={model}
                          subCategories={subCategories}
                          query={query}
                          theme={theme}
                          onItemPress={onItemPress} />
      )}
    </>
  }
}

export default CategoryList
