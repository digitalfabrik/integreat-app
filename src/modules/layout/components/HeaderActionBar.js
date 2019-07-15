// @flow

import React from 'react'
import Link from 'redux-first-router-link'

import ReactTooltip from 'react-tooltip'
import HeaderActionItem from '../HeaderActionItem'
import styled from 'styled-components'

const ActionItems = styled.div`
  justify-content: flex-end;
  
  & > *,
  & img {
    width: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
    height: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
    box-sizing: border-box;
    cursor: pointer;
    
    @media ${props => props.theme.dimensions.smallViewport} {
      width: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
      height: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
    }
  }
  
  & img {
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
  }
`

type PropsType = {|
  className?: string,
  items: Array<HeaderActionItem>
|}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
class HeaderActionBar extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const { items, className } = this.props
    return (
      <ActionItems className={className}>
        {items.map((item, index) => {
          return item.node
            ? <React.Fragment key={index}>{item.node}</React.Fragment>
            : <Link key={index} to={item.href} data-tip={item.text} aria-label={item.text}>
              <img src={item.iconSrc} />
            </Link>
        })}
      </ActionItems>
    )
  }
}

export default HeaderActionBar
