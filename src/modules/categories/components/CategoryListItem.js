// @flow

import * as React from 'react'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import styled from 'styled-components'
import { Text } from 'react-native'
import type { ThemeType } from 'modules/theme/constants/theme'
import FastImage from 'react-native-fast-image'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'

const Row = styled.View`
  margin: 12px 0;
`

const CategoryThumbnail = styled(FastImage)`
  width: 40px;
  height: 40px;
  padding: 8px;
`

type PropsType = {
  category: { id: number, title: string, thumbnail: string, path: string },
  subCategories: Array<{ id: number, title: string, thumbnail: string, path: string }>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { id: number, title: string, thumbnail: string, path: string }) => void
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<PropsType> {
  onCategoryPress = () => {
    this.props.onItemPress(this.props.category)
  }

  renderSubCategories (): Array<React.Node> {
    const {subCategories} = this.props
    return subCategories.map(subCategory =>
      <SubCategoryListItem key={subCategory.id}
                           subCategory={subCategory} onItemPress={this.props.onItemPress}
                           theme={this.props.theme} />
    )
  }

  renderTitle (): React.Node {
    const {query} = this.props
    return <CategoryCaption search={query || ''}>
      <Text>{this.props.category.title}</Text>
    </CategoryCaption>
  }

  render () {
    const {category} = this.props
    return (
      <Row>
        <StyledLink onPress={this.onCategoryPress} underlayColor={this.props.theme.colors.backgroundAccentColor}>
          <>
            <CategoryThumbnail source={category.thumbnail ? {uri: category.thumbnail} : iconPlaceholder}
                               resizeMode={FastImage.resizeMode.contain} />
            {this.renderTitle()}
          </>
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
