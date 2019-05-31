// @flow

import * as React from 'react'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import styled from 'styled-components/native'
import type { ThemeType } from 'modules/theme/constants/theme'
import FastImage from 'react-native-fast-image'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'

const Row = styled.View`
  flex: 1;
`

const CategoryTitle = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontFamilyRegular};
  color: ${props => props.theme.colors.textColor};
  margin: 0 10px;
`

const CategoryThumbnail = styled(FastImage)`
  align-self: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin: 10px;
`

type PropsType = {
  category: { title: string, thumbnail: string, path: string },
  subCategories: Array<{ title: string, thumbnail: string, path: string }>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<PropsType> {
  onCategoryPress = () => {
    this.props.onItemPress(this.props.category)
  }

  renderSubCategories (): Array<React.Node> {
    const {subCategories, theme, onItemPress} = this.props
    return subCategories.map(subCategory =>
      <SubCategoryListItem key={subCategory.path} subCategory={subCategory} onItemPress={onItemPress}
                           theme={theme} />
    )
  }

  renderTitle (): React.Node {
    const {query, theme} = this.props
    return <CategoryCaption search={query || ''}>
      <CategoryTitle theme={theme}>{this.props.category.title}</CategoryTitle>
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
