import React, { ReactElement } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { CategoryModel, getExcerpt, normalizeString } from 'api-client'

import { EXCERPT_MAX_CHARS } from '../constants'

const Row = styled.li`
  width: 100%;
`

const CategoryThumbnail = styled.img`
  width: 30px;
  height: 30px;
  padding: 0 5px;
  flex-shrink: 0;
  object-fit: contain;
`

const CategoryTitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const CategoryItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 5px;
  color: inherit;
  text-decoration: inherit;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  word-wrap: break-word;
`

const StyledHighlighter = styled(Highlighter)`
  display: inline-block;
`

const StyledLink = styled(Link)`
  display: inline-flex;
  margin: 0 auto;
  width: inherit;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`

type SearchListItemProps = {
  category: CategoryModel
  contentWithoutHtml: string
  query: string
}

const SearchListItem = ({ category, contentWithoutHtml, query }: SearchListItemProps): ReactElement => {
  const theme = useTheme()

  const excerpt = getExcerpt(contentWithoutHtml, { query, maxChars: EXCERPT_MAX_CHARS })

  const Title = (
    <Highlighter
      dir='auto'
      searchWords={query ? [query] : []}
      aria-label={category.title}
      autoEscape
      sanitize={normalizeString}
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      textToHighlight={category.title}
    />
  )

  const Content = query && excerpt.length > 0 && (
    <StyledHighlighter
      aria-label={excerpt}
      searchWords={[query]}
      autoEscape
      sanitize={normalizeString}
      textToHighlight={excerpt}
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
    />
  )

  return (
    <Row>
      <StyledLink to={category.path}>
        <CategoryItemContainer dir='auto'>
          <CategoryTitleContainer>
            {!!category.thumbnail && <CategoryThumbnail alt='' src={category.thumbnail} />}
            {Title}
          </CategoryTitleContainer>
          <div style={{ margin: '0 5px', fontSize: '12px' }} dir='auto'>
            {Content}
          </div>
        </CategoryItemContainer>
      </StyledLink>
    </Row>
  )
}

export default SearchListItem
