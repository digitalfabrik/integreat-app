import React, { ReactElement } from 'react'
import styled from 'styled-components'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Button from './base/Button'
import Icon from './base/Icon'

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
} & ItemProps

const ToolbarItem = ({ href, text, icon, onClick }: ToolbarItemProps): ReactElement => (
  // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
  <StyledToolbarItem as={onClick ? Button : undefined} href={href} onClick={onClick} ariaLabel={text}>
    <StyledIcon src={icon} />
    <StyledSmallViewTip>{text}</StyledSmallViewTip>
  </StyledToolbarItem>
)

export default ToolbarItem
