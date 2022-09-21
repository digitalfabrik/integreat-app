import React, { ReactNode } from 'react'
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
  categories: Array<{ model: CategoryModel; titleMatch?: boolean; subCategories: Array<CategoryModel> }>
  /** A search query to highlight in the categories titles */
  query?: string
  formatter?: DateFormatter
  category?: CategoryModel
  onInternalLinkClick: (link: string) => void
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { categories, query, onInternalLinkClick, formatter, category } = this.props
    return (
      <div>
        {category?.title && <Caption title={category.title} />}
        {category?.content && <RemoteContent html={category.content} onInternalLinkClick={onInternalLinkClick} />}
        {category?.content && formatter && (
          <LastUpdateInfo lastUpdate={category.lastUpdate} formatter={formatter} withText />
        )}
        <List>
          {categories.map(categoryItem => (
            <CategoryEntry
              key={categoryItem.model.path}
              category={categoryItem.model}
              titleMatch={categoryItem.titleMatch}
              subCategories={categoryItem.subCategories}
              query={query}
            />
          ))}
        </List>
      </div>
    )
  }
}

export default CategoryList
