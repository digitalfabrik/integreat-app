// @flow

import * as React from 'react'

import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import HTML from 'react-native-render-html'
import type { ThemeType } from 'modules/theme/constants/theme'
import { ScrollView } from 'react-native'

type PropsType = {
  categories: Array<{|
    model: { id: number, title: string, thumbnail: string, path: string },
    subCategories: Array<{ id: number, title: string, thumbnail: string, path: string }>
  |}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { id: number, title: string, thumbnail: string, path: string }) => void
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<PropsType> {
  render () {
    const {categories, title, content, query} = this.props
    return (
      <ScrollView>
        {title && <Caption title={title} />}
        {!!content && <HTML html={content} />}
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
      </ScrollView>
    )
  }
}

export default CategoryList
