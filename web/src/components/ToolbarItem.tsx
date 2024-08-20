import React, { ReactElement } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import CleanAnchor from './CleanAnchor'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  padding: 8px;
  cursor: pointer;
  border: none;
  color: ${props => props.theme.colors.textColor};
  background-color: transparent;
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

const ToolbarItem = ({ href, text, icon, onClick, id }: ToolbarItemProps): ReactElement => (
  // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
  <StyledToolbarItem as={onClick ? Button : undefined} id={id} href={href} onClick={onClick} label={text}>
    <StyledIcon src={icon} />
    <StyledSmallViewTip>{text}</StyledSmallViewTip>
  </StyledToolbarItem>
)

export default ToolbarItem
