import * as React from 'react'
import { ReactNode } from 'react'
import Highlighter from 'react-native-highlight-words'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import { contentDirection } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import { normalizeSearchString } from '../utils/helpers'
import { CategoryListModelType } from './CategoryList'
import ContentMatcher from './ContentMatcher'
import SimpleImage from './SimpleImage'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'

const NUM_WORDS_SURROUNDING_MATCH = 10
const FlexStyledLink = styled(StyledLink)`
  display: flex;
  flex-direction: column;
`
type DirectionContainerPropsType = {
  language: string
  children: React.ReactNode
  theme: ThemeType
}
const DirectionContainer = styled.View<DirectionContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`
const CategoryEntryContainer = styled.View<{ language: string }>`
  flex: 1;
  flex-direction: ${props => contentDirection(props.language)};
  align-self: center;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const CategoryTitle = styled(Highlighter)<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
`
const CategoryThumbnail = styled(SimpleImage)`
  align-self: center;
  flex-shrink: 0;
  width: ${dimensions.categoryListItem.iconSize}px;
  height: ${dimensions.categoryListItem.iconSize}px;
  margin: ${dimensions.categoryListItem.margin}px;
`
type PropsType = {
  category: CategoryListModelType
  subCategories: Array<CategoryListModelType>

  /** A search query to highlight in the category title */
  query?: string
  theme: ThemeType
  onItemPress: (tile: CategoryListModelType) => void
  language: string
}

/**
 * Displays a single CategoryListItem
 */

class CategoryListItem extends React.Component<PropsType> {
  contentMatcher = new ContentMatcher()
  onCategoryPress = (): void => {
    const { onItemPress, category } = this.props
    onItemPress(category)
  }

  renderSubCategories(): Array<React.ReactNode> {
    const { language, subCategories, theme, onItemPress } = this.props
    return subCategories.map(subCategory => (
      <SubCategoryListItem
        key={subCategory.path}
        subCategory={subCategory}
        onItemPress={onItemPress}
        language={language}
        theme={theme}
      />
    ))
  }

  getMatchedContent(numWordsSurrounding: number): ReactNode {
    const { query, theme, category } = this.props
    const textToHighlight = this.contentMatcher.getMatchedContent(
      query,
      category.contentWithoutHtml,
      numWordsSurrounding
    )

    if (textToHighlight === null || !query) {
      return null
    }

    return (
      <Highlighter
        searchWords={[query]}
        sanitize={normalizeSearchString}
        textToHighlight={textToHighlight}
        autoEscape
        highlightStyle={{
          backgroundColor: theme.colors.backgroundColor,
          fontWeight: 'bold'
        }}
      />
    )
  }

  renderTitle(): ReactNode {
    const { query, category, language } = this.props
    return (
      <CategoryEntryContainer language={language}>
        <CategoryTitle
          language={language}
          autoEscape
          textToHighlight={category.title}
          sanitize={normalizeSearchString}
          searchWords={query ? [query] : []}
          highlightStyle={{
            fontWeight: 'bold'
          }}
        />
        {this.getMatchedContent(NUM_WORDS_SURROUNDING_MATCH)}
      </CategoryEntryContainer>
    )
  }

  render(): ReactNode {
    const { language, category, theme } = this.props
    return (
      <>
        <FlexStyledLink onPress={this.onCategoryPress} underlayColor={theme.colors.backgroundAccentColor}>
          <DirectionContainer language={language}>
            <CategoryThumbnail source={category.thumbnail || iconPlaceholder} />
            {this.renderTitle()}
          </DirectionContainer>
        </FlexStyledLink>
        {this.renderSubCategories()}
      </>
    )
  }
}

export default CategoryListItem
