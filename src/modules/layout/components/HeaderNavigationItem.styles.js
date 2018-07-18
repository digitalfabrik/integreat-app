import styled from 'styled-components'
import Link from 'redux-first-router-link'

const NavigationItem = styled(Link)`
  ${props => props.theme.helpers.removeLinkHighlighting};
  flex: 1;
  color: ${props => props.theme.colors.textColor};
  font-size: 1.1em;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;

  @media ${props => props.theme.dimensions.smallViewport} {
    font-size: 0.9em;
  }
`

export const InactiveNavigationItem = NavigationItem.withComponent('span').extend`
  color: ${props => props.theme.colors.textSecondaryColor};
`

export const ActiveNavigationItem = NavigationItem.extend`
  ${props => props.selected
    ? `font-weight: 700;`
    : `:hover {
      font-weight: 700;
    }`}
`
