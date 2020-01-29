// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'
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

const DisabledNavigationItem = styled(NavigationItem.withComponent('span'))`
  color: ${props => props.theme.colors.textDisabledColor};
`

const ActiveNavigationItem = styled(NavigationItem)`
  ${
  props => props.selected
    ? 'font-weight: 700;'
    : `:hover {
        font-weight: 700;
       }`}
`

type PropsType = {|
  text: string,
  href: string,
  selected: boolean,
  active: boolean,
  tooltip?: string
|}

/**
 * Renders a Link or a Span in the HeaderNavigationBar depending on the active prop
 */
class HeaderNavigationItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const { active, text, tooltip, selected, href } = this.props
    if (active) {
      return <ActiveNavigationItem key={text} to={href} selected={selected}>
        {text}
      </ActiveNavigationItem>
    } else {
      return <DisabledNavigationItem key={text} data-tip={tooltip}>
        {text}
      </DisabledNavigationItem>
    }
  }
}

export default HeaderNavigationItem
