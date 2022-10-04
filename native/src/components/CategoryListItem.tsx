import React, { ReactElement } from 'react'
import Highlighter from 'react-native-highlight-words'
import styled, { useTheme } from 'styled-components/native'

import { normalizeSearchString } from 'api-client'

import iconPlaceholder from '../assets/IconPlaceholder.png'
import { contentDirection } from '../constants/contentDirection'
import dimensions from '../constants/dimensions'
import { Item } from './CategoryList'
import ContentMatcher from './ContentMatcher'
import SimpleImage from './SimpleImage'
import StyledLink from './StyledLink'
import SubCategoryListItem from './SubCategoryListItem'

const NUM_WORDS_SURROUNDING_MATCH = 10

const FlexStyledLink = styled(StyledLink)`
  display: flex;
  flex-direction: column;
`
const DirectionContainer = styled.View<{ language: string }>`
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

const CategoryTitle = styled.Text<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
`

const HighlighterCategoryTitle = styled(Highlighter)<{ language: string }>`
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
  item: Item
  onItemPress: (item: { path: string }) => void
  language: string
  query?: string
}

const CategoryListItem = ({ language, item, onItemPress, query }: PropsType): ReactElement => {
  const theme = useTheme()
  const contentMatcher = new ContentMatcher()
  const excerpt =
    contentMatcher.getMatchedContent(query, item.contentWithoutHtml, NUM_WORDS_SURROUNDING_MATCH) ??
    contentMatcher.getContentAfterMatchIndex(item.contentWithoutHtml ?? '', 0, 2 * NUM_WORDS_SURROUNDING_MATCH)

  const content = query && (
    <Highlighter
      searchWords={[query]}
      sanitize={normalizeSearchString}
      textToHighlight={excerpt}
      autoEscape
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
    />
  )

  const title = query ? (
    <CategoryEntryContainer>
      <TitleDirectionContainer language={language}>
        <HighlighterCategoryTitle
          language={language}
          autoEscape
          textToHighlight={item.title}
          sanitize={normalizeSearchString}
          searchWords={query ? [query] : []}
          highlightStyle={{
            fontWeight: 'bold',
          }}
        />
      </TitleDirectionContainer>
      {content}
    </CategoryEntryContainer>
  ) : (
    <CategoryEntryContainer>
      <TitleDirectionContainer language={language}>
        <CategoryTitle language={language} android_hyphenationFrequency='full'>
          {item.title}
        </CategoryTitle>
      </TitleDirectionContainer>
    </CategoryEntryContainer>
  )

  return (
    <>
      <FlexStyledLink onPress={() => onItemPress(item)} underlayColor={theme.colors.backgroundAccentColor}>
        <DirectionContainer language={language}>
          <CategoryThumbnail source={item.thumbnail || iconPlaceholder} />
          {title}
        </DirectionContainer>
      </FlexStyledLink>
      {item.subCategories.map(subCategory => (
        <SubCategoryListItem
          key={subCategory.path}
          subCategory={subCategory}
          onItemPress={onItemPress}
          language={language}
        />
      ))}
    </>
  )
}

export default CategoryListItem
