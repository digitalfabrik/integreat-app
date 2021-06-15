import React from 'react'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import CategoryEntry from './CategoryEntry'
import { CategoryModel, DateFormatter } from 'api-client'
import styled from 'styled-components'
import { helpers } from '../constants/theme'
import LastUpdateInfo from './LastUpdateInfo'

const List = styled.div`
  & a {
    ${helpers.removeLinkHighlighting}
  }
`

const Centering = styled.div`
  text-align: center;
`

const CategoryIcon = styled.img`
  width: 150px;
  height: 150px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

type PropsType = {
  categories: Array<{ model: CategoryModel; contentWithoutHtml?: string; subCategories: Array<CategoryModel> }>
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
  render() {
    const { categories, query, onInternalLinkClick, formatter, category } = this.props
    return (
      <div>
        {category?.thumbnail && (
          <Centering>
            <CategoryIcon src={category.thumbnail} alt='' />
          </Centering>
        )}
        {category?.title && <Caption title={category.title} />}
        {category?.content && (
          <RemoteContent
            dangerouslySetInnerHTML={{ __html: category.content }}
            onInternalLinkClick={onInternalLinkClick}
          />
        )}
        {category?.content && category.lastUpdate && formatter && (
          <LastUpdateInfo lastUpdate={category.lastUpdate} formatter={formatter} withText />
        )}
        <List>
          {categories.map(categoryItem => (
            <CategoryEntry
              key={categoryItem.model.hash}
              category={categoryItem.model}
              contentWithoutHtml={categoryItem.contentWithoutHtml}
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
