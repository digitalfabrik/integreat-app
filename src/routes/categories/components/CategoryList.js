// @flow

import React from 'react'
import styled from 'styled-components'

import RemoteContent from 'modules/common/components/RemoteContent'
import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'

const List = styled.div`
  & a {
    ${props => props.theme.helpers.removeA}
  }
`

type Props = {
  categories: Array<{model: CategoryModel, children: Array<CategoryModel>}>,
  title?: string,
  content?: string,
  /** A search query to highlight in the categories titles */
  query?: string
}

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component<Props> {
  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <RemoteContent centered dangerouslySetInnerHTML={{__html: this.props.content}} />
        <List>
          {this.props.categories.map(({model, children}) =>
            <CategoryListItem key={model.id}
                              category={model}
                              children={children}
                              query={this.props.query} />)}
        </List>
      </div>
    )
  }
}

export default CategoryList
