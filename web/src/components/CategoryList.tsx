import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CategoryModel, DateFormatter } from 'api-client'

import { helpers } from '../constants/theme'
import Caption from './Caption'
import CategoryEntry from './CategoryEntry'
import LastUpdateInfo from './LastUpdateInfo'
import RemoteContent from './RemoteContent'

const List = styled.div`
  & a {
    ${helpers.removeLinkHighlighting}
  }
`

type PropsType = {
  items: { category: CategoryModel; subCategories: CategoryModel[]; contentWithoutHtml?: string }[]
  query?: string
  formatter?: DateFormatter
  category?: CategoryModel
  onInternalLinkClick: (link: string) => void
}

const CategoryList = ({ items, query, formatter, category, onInternalLinkClick }: PropsType): ReactElement => (
  <div>
    {category?.title && <Caption title={category.title} />}
    {category?.content && <RemoteContent html={category.content} onInternalLinkClick={onInternalLinkClick} />}
    {category?.content && formatter && (
      <LastUpdateInfo lastUpdate={category.lastUpdate} formatter={formatter} withText />
    )}
    <List>
      {items.map(it => (
        <CategoryEntry key={it.category.path} category={it.category} subCategories={it.subCategories} query={query} />
      ))}
    </List>
  </div>
)

export default CategoryList
