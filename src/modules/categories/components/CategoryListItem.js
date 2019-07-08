// @flow

import * as React from 'react'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'
import Image from '../../common/components/Image'

const Row: StyledComponent<{}, {}, *> = styled.View`
  flex: 1;
`

const CategoryTitle = styled.Text`
  align-self: center;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
  margin: 0 10px;
`

const CategoryThumbnail = styled(Image)`
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
      <SubCategoryListItem key={subCategory.path} subCategory={subCategory} onItemPress={onItemPress} theme={theme} />
    )
  }

  renderTitle (): React.Node {
    const {query, theme} = this.props
    return <CategoryCaption search={query || ''} theme={theme}>
      <CategoryTitle theme={theme}>{this.props.category.title}</CategoryTitle>
    </CategoryCaption>
  }

  render () {
    const {category} = this.props
    return (
      <Row>
        <StyledLink onPress={this.onCategoryPress} underlayColor={this.props.theme.colors.backgroundAccentColor}>
          <>
            <CategoryThumbnail source={category.thumbnail ? category.thumbnail : iconPlaceholder} />
            {this.renderTitle()}
          </>
        </StyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
