import { mapValues } from 'lodash'
import { Moment } from 'moment'
import React, { ReactElement } from 'react'

import { PageResourceCacheEntryStateType, PageResourceCacheStateType } from '../redux/StateType'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import CategoryListCaption from './CategoryListCaption'
import CategoryListContent from './CategoryListContent'
import CategoryListItem from './CategoryListItem'

export type SimpleItem = {
  title: string
  path: string
  thumbnail: string
  contentWithoutHtml?: string
}

export type Item = SimpleItem & {
  subCategories: SimpleItem[]
}

type ListContentModelType = {
  files: PageResourceCacheStateType
  resourceCacheUrl: string
  content: string
  lastUpdate: Moment
}
type PropsType = {
  items: Item[]
  title?: string
  listContent?: ListContentModelType | null | undefined
  query?: string
  onItemPress: (item: { path: string }) => void
  language: string
}
/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */

const CategoryList = ({ items, title, listContent, query, onItemPress, language }: PropsType): ReactElement => {
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
      {items.map(it => (
        <CategoryListItem key={it.path} item={it} language={language} query={query} onItemPress={onItemPress} />
      ))}
    </>
  )
}

export default CategoryList
