// @flow

import React from 'react'
import Link from 'redux-first-router-link'

import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  width: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
  height: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);

  @media ${props => props.theme.dimensions.smallViewport} {
    width: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
    height: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
  }

  & > img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
  }
`

const StyledSpan = StyledLink.withComponent('span')

type PropsType = {|
  href?: string,
  text: string,
  iconSrc: string
|}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
class HeaderActionItemLink extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const { href, text, iconSrc } = this.props
    const img = <img alt='' src={iconSrc} />
    return href
      ? <StyledLink to={href} data-tip={text} data-event='mouseover' data-event-off='click mouseout' aria-label={text}>{img}</StyledLink>
      : <StyledSpan data-tip={text} data-event='mouseover' data-event-off='click mouseout' aria-label={text}>{img}</StyledSpan>
  }
}

export default HeaderActionItemLink
