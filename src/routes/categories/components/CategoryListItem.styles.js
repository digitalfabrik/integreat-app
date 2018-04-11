import styled from 'styled-components'
import Highlighter from 'react-highlighter'
import Link from 'redux-first-router-link'

export const Row = styled.div`
  margin: 20px 0;
`

export const CategoryThumbnail = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

export const SubCategoryThumbnail = CategoryThumbnail.extend`
  width: 26px;
  height: 26px;
  padding: 5px 15px;
`
export const SubCategoryThumbnailDiv = SubCategoryThumbnail.withComponent('div')

export const CategoryCaption = styled(Highlighter)`
  height: 100%;
  min-width: 1px; /* needed to enabled line breaks for to long words, exact value doesn't matter, @Max: DO NOT CHANGE */
  flex-grow: 1;
  margin-left: 10px;
  padding: 15px 0;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  word-wrap: break-word;
`

export const SubCategoryCaption = CategoryCaption.extend`
  padding: 10px 0 10px 15px;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

export const StyledLink = styled(Link)`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0 auto;
`
