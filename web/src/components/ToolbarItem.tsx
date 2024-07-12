import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import CleanAnchor from './CleanAnchor'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledToolbarButton = styled(Button)`
  margin: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

const StyledToolbarLink = styled(CleanAnchor)`
  margin: 8px;
  color: ${props => props.theme.colors.textColor};
  text-align: center;

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type ItemProps =
  | {
      onClick: () => void
      href?: undefined
    }
  | {
      onClick?: undefined
      href: string
    }

type ToolbarItemProps = {
  icon: string
  text: string
  id?: string
} & ItemProps

const ToolbarItem = ({ href, text, icon, onClick, id }: ToolbarItemProps): ReactElement => {
  if (onClick) {
    return (
      <StyledToolbarButton onClick={onClick} label={text} id={id}>
        <StyledIcon src={icon} />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarButton>
    )
  }

  return (
    <StyledToolbarLink href={href} label={text} id={id}>
      <StyledIcon src={icon} />
      <StyledSmallViewTip>{text}</StyledSmallViewTip>
    </StyledToolbarLink>
  )
}

export default ToolbarItem
