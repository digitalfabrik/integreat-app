import styled, { css } from 'styled-components'
import Link from 'redux-first-router-link'

export const Element = styled(Link)`
  ${props => props.theme.helpers.removeLinkHighlighting};
  height: ${props => props.theme.dimensions.headerHeightLarge}px;
  min-width: 90px;
  max-width: 120px;
  flex: 1 1 90px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-size: 1.2em;
  line-height: ${props => props.theme.dimensions.headerHeightLarge}px;
  text-align: center;
  border-radius: 30px;
  transition: background-color 0.2s, border-radius 0.2s;
  user-select: none;
  
  :hover {
    color: ${props => props.theme.colors.textColor};
    font-weight: 700;
    border-radius: 0;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    height: ${props => props.theme.dimensions.headerHeightSmall}px;
    min-width: 70px;
    flex: 1 1 70px;
    font-size: 1em;
    line-height: ${props => props.theme.dimensions.headerHeightSmall}px;
  }
`

export const ActiveElement = Element.withComponent('span').extend`
  color: ${props => props.theme.colors.textColor};
  font-weight: 700;
`

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  color: ${props => props.theme.colors.textColor};
  text-align: center;
  
  ${props => props.vertical && css`
    flex-flow: column;
    align-items: center;
  
    & ${Element} {
      flex: 1;
    }
  `}
`
