// @flow

import React from 'react'

import RemoteContent from '../../../modules/common/components/RemoteContent'
import Caption from '../../../modules/common/components/Caption'
import CategoryEntry from './CategoryEntry'
import { CategoryModel } from 'api-client'
import styled from 'styled-components'
import helpers from '../../../modules/theme/constants/helpers'

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

type PropsType = {|
  categories: Array<{| model: CategoryModel, contentWithoutHtml?: string, subCategories: Array<CategoryModel> |}>,
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
        {thumbnail && <Centering><CategoryIcon src={thumbnail} alt='' /></Centering>}
        {title && <Caption title={title} />}
        {content && <RemoteContent centered dangerouslySetInnerHTML={{ __html: content }}
                                   onInternalLinkClick={onInternalLinkClick} />}
        <List>
          {categories.map(categoryItem =>
            <CategoryEntry key={categoryItem.model.hash}
                              category={categoryItem.model}
                              contentWithoutHtml={categoryItem.contentWithoutHtml}
                              subCategories={categoryItem.subCategories}
                              query={query} />
          )}
        </List>
      </div>
    )
  }
}

export default CategoryList
