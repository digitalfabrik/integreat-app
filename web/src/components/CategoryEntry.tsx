import React, { ReactElement, useMemo } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { CategoryModel, normalizeSearchString, parseHTML } from 'api-client'

import iconPlaceholder from '../assets/IconPlaceholder.svg'
import ContentMatcher from './ContentMatcher'

const NUM_WORDS_SURROUNDING_MATCH = 10

const Row = styled.div`
  margin: 12px 0;

  & > * {
    width: 100%;
  }
`

const SubCategory = styled.div`
  text-align: end;

  & > * {
    width: calc(100% - 60px);
    text-align: start;
  }
`

const CategoryThumbnail = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

const CategoryListItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 5px;
  color: inherit;
  text-decoration: inherit;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  word-wrap: break-word;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

const SubCategoryCaption = styled(CategoryListItem)`
  margin: 0 15px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

const ContentMatchItem = styled(Highlighter)`
  display: inline-block;
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`

type PropsType = {
  category: CategoryModel
  titleMatch?: boolean
  subCategories: Array<CategoryModel>
  query?: string
}

const CategoryEntry = ({ category, titleMatch, subCategories, query }: PropsType): ReactElement => {
  const theme = useTheme()
  const textToHighlight = useMemo<string | null>(() => {
    const contentMatcher = new ContentMatcher()
    return contentMatcher.getMatchedContent(query, parseHTML(category.content), NUM_WORDS_SURROUNDING_MATCH)
  }, [category.content, query])

  const SubCategories = subCategories.map(subCategory => (
    <SubCategory key={subCategory.path} dir='auto'>
      <StyledLink to={subCategory.path}>
        <SubCategoryCaption aria-label={subCategory.title}>{subCategory.title}</SubCategoryCaption>
      </StyledLink>
    </SubCategory>
  ))

  const Title = (
    <Highlighter
      dir='auto'
      searchWords={query ? [query] : []}
      aria-label={category.title}
      autoEscape
      sanitize={normalizeSearchString}
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      textToHighlight={category.title}
    />
  )

  const Content =
    textToHighlight && query && !titleMatch ? (
      <ContentMatchItem
        aria-label={textToHighlight}
        searchWords={[query]}
        autoEscape
        sanitize={normalizeSearchString}
        textToHighlight={textToHighlight}
        highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      />
    ) : (
      query && (
        <p>
          {new ContentMatcher()
            .getWords(parseHTML(category.content).slice(0))
            .slice(0, 2 * NUM_WORDS_SURROUNDING_MATCH)
            .join(' ')}
        </p>
      )
    )

  return (
    <Row>
      <StyledLink to={category.path}>
        <CategoryThumbnail alt='' src={category.thumbnail || iconPlaceholder} />
        <CategoryListItem dir='auto'>
          {Title}
          <div style={{ margin: '0 5px', fontSize: '12px' }} dir='auto'>
            {Content}
          </div>
        </CategoryListItem>
      </StyledLink>
      {SubCategories}
    </Row>
  )
}

export default CategoryEntry
