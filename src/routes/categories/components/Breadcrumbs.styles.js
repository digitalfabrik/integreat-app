import styled from 'styled-components'
import { Link } from 'redux-little-router'

export const Wrapper = styled.div`
  margin: 10px 0;
  white-space: nowrap;
  overflow-x: auto;

  /* avoid changing height when switching between pages (show line even if there are no breadcrumbs) */
  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

export const Breadcrumb = styled(Link)`
  ${props => props.theme.helpers.removeA}
`

export const Separator = styled.span`
  &::after {
    color: ${props => props.theme.colors.textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`

export const Title = styled.span`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 15px;
`
