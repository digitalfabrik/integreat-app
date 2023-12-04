import React, { ReactElement } from 'react'
import styled from 'styled-components'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledToolbarButtonItem = StyledToolbarItem.withComponent(Button)

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type ToolbarItemProps = {
  href?: string
  onClick?: () => void
  icon: string
  text: string
}

const ToolbarItem = ({ href, text, icon, onClick }: ToolbarItemProps): ReactElement => (
  <>
    {!!href && (
      <StyledToolbarItem href={href} ariaLabel={text}>
        <StyledIcon src={icon} />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarItem>
    )}
    {!!onClick && (
      <StyledToolbarButtonItem onClick={onClick} ariaLabel={text}>
        <StyledIcon src={icon} />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarButtonItem>
    )}
  </>
)

export default ToolbarItem
