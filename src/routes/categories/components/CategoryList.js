import React from 'react'
import PropTypes from 'prop-types'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import RemoteContent from 'modules/common/components/RemoteContent'

import styled from 'styled-components'
import Caption from 'modules/common/components/Caption'
import CategoryListItem from './CategoryListItem'
import { removeA } from 'modules/common/constants/helpers'

const List = styled.div`
  & a {
    ${() => removeA}
  }
`

/**
 * Displays a ContentList which is a list of categories, a caption and a thumbnail
 */
class CategoryList extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
      model: PropTypes.instanceOf(CategoryModel).isRequired,
      children: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired
    })).isRequired,
    title: PropTypes.string,
    content: PropTypes.string
  }

  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        <RemoteContent centered dangerouslySetInnerHTML={{__html: this.props.content}} />
        <List>
          {this.props.categories.map(({model, children}) =>
            <CategoryListItem key={model.id}
                              category={model}
                              children={children} />)}
        </List>
      </div>
    )
  }
}

export default CategoryList
