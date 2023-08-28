import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CategoryModel } from 'api-client'

import { helpers } from '../constants/theme'
import Caption from './Caption'
import CategoryListItem from './CategoryListItem'
import LastUpdateInfo from './LastUpdateInfo'
import RemoteContent from './RemoteContent'

const List = styled.ul`
  list-style-type: none;

  & a {
    ${helpers.removeLinkHighlighting}
  }
`

type CategoryListProps = {
  items: { category: CategoryModel; subCategories: CategoryModel[]; contentWithoutHtml?: string }[]
  category?: CategoryModel
  onInternalLinkClick: (link: string) => void
}

const CategoryList = ({ items, category, onInternalLinkClick }: CategoryListProps): ReactElement => (
  <div>
    {!!category?.title && <Caption title={category.title} />}
    {!!category?.content && <RemoteContent html={category.content} onInternalLinkClick={onInternalLinkClick} />}
    {!!category?.content && <LastUpdateInfo lastUpdate={category.lastUpdate} withText />}
    <List>
      {items.map(({ category, subCategories }) => (
        <CategoryListItem key={category.path} category={category} subCategories={subCategories} />
      ))}
    </List>
  </div>
)

export default CategoryList
