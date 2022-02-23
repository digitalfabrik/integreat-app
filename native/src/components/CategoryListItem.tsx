import * as React from 'react'
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
}
const DirectionContainer = styled.View<DirectionContainerPropsType>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`
const CategoryEntryContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
  padding: 15px 5px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const TitleDirectionContainer = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
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

const CategoryListItem = ({
  language,
  subCategories,
  onItemPress,
  query,
  category,
  theme
}: PropsType): React.ReactElement => {
  const contentMatcher = new ContentMatcher()
  const onCategoryPress = (): void => {
    onItemPress(category)
  }

  const renderSubCategories = () =>
    subCategories.map(subCategory => (
      <SubCategoryListItem
        key={subCategory.path}
        subCategory={subCategory}
        onItemPress={onItemPress}
        language={language}
        theme={theme}
      />
    ))

  const getMatchedContent = (numWordsSurrounding: number) => {
    const textToHighlight = contentMatcher.getMatchedContent(query, category.contentWithoutHtml, numWordsSurrounding)

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

  const renderTitle = () => (
    <CategoryEntryContainer>
      <TitleDirectionContainer language={language}>
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
      </TitleDirectionContainer>
      {getMatchedContent(NUM_WORDS_SURROUNDING_MATCH)}
    </CategoryEntryContainer>
  )

  return (
    <>
      <FlexStyledLink onPress={onCategoryPress} underlayColor={theme.colors.backgroundAccentColor}>
        <DirectionContainer language={language}>
          <CategoryThumbnail source={category.thumbnail || iconPlaceholder} />
          {renderTitle()}
        </DirectionContainer>
      </FlexStyledLink>
      {renderSubCategories()}
    </>
  )
}

export default CategoryListItem
