// @flow

import * as React from 'react'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import CategoryCaption from './CategoryCaption'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'
import Image from '../../common/components/Image'
import { contentDirection } from '../../i18n/contentDirection'

const FlexStyledLink: StyledComponent<{}, ThemeType, *> = styled(StyledLink)`
  display: flex;
  flex-direction: column;
`

type DirectionContainerPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const DirectionContainer: StyledComponent<DirectionContainerPropsType, ThemeType, *> = styled.View`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

const Row: StyledComponent<{}, {}, *> = styled.View`
  flex: 1;
`

const CategoryTitle = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
`

const CategoryThumbnail = styled(Image)`
  align-self: center;
  flex-shrink: 0;
  width: ${props => props.theme.dimensions.categoryListItem.iconSize}px;
  height: ${props => props.theme.dimensions.categoryListItem.iconSize}px;
  margin: ${props => props.theme.dimensions.categoryListItem.margin}px;
`

type PropsType = {
  category: { title: string, thumbnail: string, path: string },
  subCategories: Array<{ title: string, thumbnail: string, path: string }>,
  /** A search query to highlight in the category title */
  query?: string,
  theme: ThemeType,
  onItemPress: (tile: { title: string, thumbnail: string, path: string }) => void,
  language: string
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<PropsType> {
  onCategoryPress = () => {
    this.props.onItemPress(this.props.category)
  }

  renderSubCategories (): Array<React.Node> {
    const { language, subCategories, theme, onItemPress } = this.props
    return subCategories.map(subCategory =>
      <SubCategoryListItem key={subCategory.path}
                           subCategory={subCategory}
                           onItemPress={onItemPress}
                           language={language}
                           theme={theme} />
    )
  }

  renderTitle (): React.Node {
    const { query, theme } = this.props
    return <CategoryCaption search={query || ''} theme={theme}>
      <CategoryTitle theme={theme}>{this.props.category.title}</CategoryTitle>
    </CategoryCaption>
  }

  render () {
    const { language, category, theme } = this.props
    return (
      <Row>
        <FlexStyledLink onPress={this.onCategoryPress} underlayColor={this.props.theme.colors.backgroundAccentColor}>
          <DirectionContainer theme={theme} language={language}>
            <CategoryThumbnail source={category.thumbnail || iconPlaceholder} theme={theme} />
            {this.renderTitle()}
          </DirectionContainer>
        </FlexStyledLink>
        {this.renderSubCategories()}
      </Row>
    )
  }
}

export default CategoryListItem
