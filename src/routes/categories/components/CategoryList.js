// @flow

import React from 'react'

import RemoteContent from '../../../modules/common/components/RemoteContent'
import Caption from '../../../modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components'

const List = styled.div`
  & a {
    ${props => props.theme.helpers.removeLinkHighlighting}
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

type PropsType = {|
  categories: Array<{| model: CategoryModel, subCategories: Array<CategoryModel> |}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string,
  thumbnail?: string,
  onInternalLinkClick: string => void
|}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.PureComponent<PropsType> {
  render () {
    const { categories, title, thumbnail, content, query, onInternalLinkClick } = this.props
    return (
      <div>
        {thumbnail && <Centering><CategoryIcon src={thumbnail} /></Centering>}
        {title && <Caption title={title} />}
        {content && <RemoteContent centered dangerouslySetInnerHTML={{ __html: content }}
                                   onInternalLinkClick={onInternalLinkClick} />}
        <List>
          {categories.map(({ model, subCategories }) =>
            <CategoryListItem key={model.id}
                              category={model}
                              subCategories={subCategories}
                              query={query} />
          )}
        </List>
      </div>
    )
  }
}

export default CategoryList
