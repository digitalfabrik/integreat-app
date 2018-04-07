import styled from 'styled-components'

const opposite = direction => direction === 'ltr' ? 'rtl' : 'ltr'
export const Wrapper = styled.div`
  margin: 10px 0;
  white-space: nowrap;
  overflow-x: auto;
  direction: ${props => opposite(props.direction)};
  text-align: end;
`

export const OrderedList = styled.ol`
  direction: ${props => props.direction};
  display: inline-block;
  list-style: none;
  padding: 0;
  margin: 0;

  /* avoid changing height when switching between pages (show one line even if there are no breadcrumbs) */
  &:empty::after {
    padding-left: 1px;
    content: '';
  }
`

export const Breadcrumb = styled.li`
  display: inline;
  
  & * {
    ${props => props.theme.helpers.removeLinkHighlighting}
    color: ${props => props.theme.colors.textSecondaryColor};
    font-size: 15px;
  }
  
  &::before {
    color: ${props => props.theme.colors.textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`
