import { mapValues } from 'lodash'
import { Moment } from 'moment'
import * as React from 'react'
import { useTheme } from 'styled-components/native'

import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../redux/StateType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import CategoryListCaption from './CategoryListCaption'
import CategoryListContent from './CategoryListContent'
import CategoryListItem from './CategoryListItem'

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
  onItemPress: (tile: CategoryListModelType) => void
  language: string
}
/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */

const CategoryList = ({
  categories,
  title,
  listContent,
  query,
  onItemPress,
  language
}: PropsType): React.ReactElement => {
  const theme = useTheme()

  const getListContent = (listContent: ListContentModelType) => {
    const cacheDictionary = mapValues(listContent.files, (file: PageResourceCacheEntryStateType) =>
      file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
        ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, listContent.resourceCacheUrl)
        : file.filePath
    )
    return (
      <CategoryListContent
        content={listContent.content}
        language={language}
        cacheDictionary={cacheDictionary}
        lastUpdate={listContent.lastUpdate}
      />
    )
  }

  return (
    <>
      {title && <CategoryListCaption title={title} withThumbnail={false} />}
      {listContent && getListContent(listContent)}
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

export default CategoryList
