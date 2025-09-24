import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { getExcerpt } from 'shared'

import { EXCERPT_MAX_CHARS } from '../constants'
import Highlighter from './Highlighter'
import Link from './base/Link'

const Row = styled('li')`
  width: 100%;
`

const CategoryThumbnail = styled('img')`
  width: 30px;
  height: 30px;
  padding: 0 5px;
  flex-shrink: 0;
  object-fit: contain;
`

const CategoryTitleContainer = styled('div')`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const CategoryItemContainer = styled('div')`
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

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  }
`

type SearchListItemProps = {
  title: string
  contentWithoutHtml: string
  query: string
  path: string
  thumbnail: string | null
}

const SearchListItem = ({ title, contentWithoutHtml, query, path, thumbnail }: SearchListItemProps): ReactElement => {
  const excerpt = getExcerpt(contentWithoutHtml, { query, maxChars: EXCERPT_MAX_CHARS })

  return (
    <Row>
      <StyledLink to={path}>
        <CategoryItemContainer dir='auto'>
          <CategoryTitleContainer>
            {!!thumbnail && <CategoryThumbnail alt='' src={thumbnail} />}
            <Highlighter dir='auto' search={query} text={title} />
          </CategoryTitleContainer>
          <div style={{ margin: '0 5px', fontSize: '12px' }} dir='auto'>
            {excerpt.length > 0 && <StyledHighlighter search={query} text={excerpt} />}
          </div>
        </CategoryItemContainer>
      </StyledLink>
      <Divider />
    </Row>
  )
}

export default SearchListItem
