import * as React from 'react'
import { ReactNode } from 'react'
import CategoryListItem from './CategoryListItem'
import styled from 'styled-components/native'
import SimpleImage from './SimpleImage'
import CategoryListCaption from './CategoryListCaption'
import CategoryListContent from './CategoryListContent'
import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../redux/StateType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import { mapValues } from 'lodash'
import { Moment } from 'moment'
import { ThemeType } from 'build-configs'

export type CategoryListModelType = {
  title: string
  thumbnail: string
  path: string
  contentWithoutHtml?: string
}
export type ListEntryType = {
  model: CategoryListModelType
  subCategories: Array<CategoryListModelType>
}
export type ListContentModelType = {
  files: PageResourceCacheStateType
  resourceCacheUrl: string
  content: string
  lastUpdate: Moment
}
type PropsType = {
  categories: Array<ListEntryType>
  title?: string
  listContent?: ListContentModelType | null | undefined

  /** A search query to highlight in the categories titles */
  query?: string
  theme: ThemeType
  onItemPress: (tile: CategoryListModelType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  language: string
  thumbnail?: string
}
const CategoryThumbnail = styled(SimpleImage)`
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
  getListContent(listContent: ListContentModelType): React.ReactNode {
    const { theme, language, navigateToLink } = this.props
    const cacheDictionary = mapValues(listContent.files, (file: PageResourceCacheEntryStateType) => {
      return file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
        ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, listContent.resourceCacheUrl)
        : file.filePath
    })
    return (
      <CategoryListContent
        content={listContent.content}
        language={language}
        navigateToLink={navigateToLink}
        cacheDictionary={cacheDictionary}
        lastUpdate={listContent.lastUpdate}
        theme={theme}
      />
    )
  }

  render(): ReactNode {
    const { categories, title, listContent, query, theme, onItemPress, language, thumbnail } = this.props
    return (
      <>
        {thumbnail && <CategoryThumbnail source={thumbnail} />}
        {title && <CategoryListCaption title={title} theme={theme} withThumbnail={!!thumbnail} />}
        {listContent && this.getListContent(listContent)}
        {categories.map(({ model, subCategories }) => (
          <CategoryListItem
            key={model.path}
            category={model}
            language={language}
            subCategories={subCategories}
            query={query}
            theme={theme}
            onItemPress={onItemPress}
          />
        ))}
      </>
    )
  }
}

export default CategoryList
