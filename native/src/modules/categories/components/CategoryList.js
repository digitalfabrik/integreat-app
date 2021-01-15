// @flow

import * as React from 'react'
import CategoryListItem from './CategoryListItem'
import type { ThemeType } from '../../theme/constants'
import styled from 'styled-components/native'
import Image from '../../common/components/Image'
import CategoryListCaption from '../../../modules/common/components/CategoryListCaption'
import CategoryListContent from './CategoryListContent'
import type { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../../app/StateType'
import { RESOURCE_CACHE_DIR_PATH } from '../../endpoint/DatabaseConnector'
import { mapValues } from 'lodash'

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

export type ListContentModelType = {|
  files: PageResourceCacheStateType,
  resourceCacheUrl: string,
  content: string
|}

type PropsType = {|
  categories: Array<ListEntryType>,
  title?: string,
  listContent?: ?ListContentModelType,
  /** A search query to highlight in the categories titles */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
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
  getListContent (listContent: ListContentModelType): React.Node {
    const { theme, language, navigateToLink } = this.props
    const cacheDictionary = mapValues(listContent.files, (file: PageResourceCacheEntryStateType) => {
      return file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
        ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, listContent.resourceCacheUrl)
        : file.filePath
    })
    return <CategoryListContent content={listContent.content}
                                language={language}
                                navigateToLink={navigateToLink}
                                resourceCacheUrl={listContent.resourceCacheUrl}
                                cacheDictionary={cacheDictionary}
                                theme={theme} />
  }

  render () {
    const { categories, title, listContent, query, theme, onItemPress, language, thumbnail } = this.props

    return <>
      {thumbnail && <CategoryThumbnail source={thumbnail} />}
      {title && <CategoryListCaption title={title} theme={theme} withThumbnail={!!(thumbnail)} />}
      {listContent && this.getListContent(listContent)}
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
