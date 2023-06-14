import React, { ReactElement } from 'react'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'

type ToolbarItemProps = {
  href?: string
  onClick?: () => void
  icon: string
  text: string
}
const StyledToolbarButtonItem = StyledToolbarItem.withComponent('button')
const ToolbarItem = ({ href, text, icon, onClick }: ToolbarItemProps): ReactElement => (
  <>
    {!!href && (
      <StyledToolbarItem href={href} ariaLabel={text}>
        <img src={icon} alt='' />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarItem>
    )}
    {!!onClick && (
      <StyledToolbarButtonItem onClick={() => onClick()} aria-label={text}>
        <img src={icon} alt='' />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarButtonItem>
    )}
  </>
)

export default ToolbarItem
