import React, { ReactElement } from 'react'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Tooltip from './Tooltip'

type ToolbarItemProps = {
  href?: string
  onClick?: () => void
  icon: string
  text: string
  viewportSmall: boolean
}
const StyledToolbarButtonItem = StyledToolbarItem.withComponent('button')
const ToolbarItem = ({ href, text, icon, viewportSmall, onClick }: ToolbarItemProps): ReactElement => (
  <Tooltip text={viewportSmall ? null : text} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
    {!!href && (
      <StyledToolbarItem href={href} ariaLabel={text}>
        <img src={icon} alt='' />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarItem>
    )}
    {!!onClick && (
      <StyledToolbarButtonItem onClick={() => onClick()} aria-label={text}>
        <img src={icon} alt='' />
        {viewportSmall && <StyledSmallViewTip>{text}</StyledSmallViewTip>}
      </StyledToolbarButtonItem>
    )}
  </Tooltip>
)

export default ToolbarItem
