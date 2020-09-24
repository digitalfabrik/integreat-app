// @flow

import * as React from 'react'

import CategoryListItem from './CategoryListItem'
import Html from 'react-native-render-html'
import type { ThemeType } from '../../theme/constants'
import styled from 'styled-components/native'
import Image from '../../common/components/Image'
import CategoryListCaption from '../../../modules/common/components/CategoryListCaption'

export type CategoryListModelType = {|
  title: string,
  thumbnail: string,
  path: string,
  contentWithoutHtml?: string
|}

export type ListEntryType = {|
  model: CategoryListModelType,
  subCategories: Array<CategoryListModelType>
|}

type PropsType = {|
  categories: Array<ListEntryType>,
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

const VerticalPadding = styled.View`
  padding: 0 20px;
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
      {!!content && <VerticalPadding><Html html={content} /></VerticalPadding>}
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
