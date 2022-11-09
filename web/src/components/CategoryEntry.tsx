import React, { ReactElement } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { CategoryModel, getExcerpt, normalizeString } from 'api-client'

import iconPlaceholder from '../assets/IconPlaceholder.svg'
import { EXCERPT_MAX_CHARS } from '../constants'

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

const StyledHighlighter = styled(Highlighter)`
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

type CategoryEntryProps = {
  category: CategoryModel
  subCategories: CategoryModel[]
  contentWithoutHtml?: string
  query?: string
}

const CategoryEntry = ({ category, contentWithoutHtml, subCategories, query }: CategoryEntryProps): ReactElement => {
  const theme = useTheme()

  const excerpt = getExcerpt(contentWithoutHtml ?? '', { query, maxChars: EXCERPT_MAX_CHARS })

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
      sanitize={normalizeString}
      highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      textToHighlight={category.title}
    />
  )

  const Content = query && (
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
