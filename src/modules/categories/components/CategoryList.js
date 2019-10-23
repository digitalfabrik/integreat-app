// @flow

import * as React from 'react'

import CategoryListItem from './CategoryListItem'
import HTML from 'react-native-render-html'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import styled from 'styled-components/native'
import Image from '../../common/components/Image'
import CategoryListCaption from '../../../modules/common/components/CategoryListCaption'

type PropsType = {|
  categories: Array<{|
    model: { title: string, thumbnail: string, path: string },
    subCategories: Array<{ title: string, thumbnail: string, path: string }>
  |}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void,
  language: string,
  thumbnail?: string
|}

const CategoryThumbnail = styled(Image)`
  align-self: center;
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  margin: 10px;
`

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<PropsType> {
  render () {
    const { categories, title, content, query, theme, onItemPress, language, thumbnail } = this.props
    return <>
      {thumbnail && <CategoryThumbnail source={thumbnail} />}
      {title && <CategoryListCaption title={title} theme={theme} withThumbnail={!!(thumbnail)} />}
      {!!content && <HTML html={content} />}
      {categories.map(({ model, subCategories }) =>
        <CategoryListItem key={model.path}
                          category={model}
                          language={language}
                          subCategories={subCategories}
                          query={query}
                          theme={theme}
                          onItemPress={onItemPress} />
      )}
    </>
  }
}

export default CategoryList
