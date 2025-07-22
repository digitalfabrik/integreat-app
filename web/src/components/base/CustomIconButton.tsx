import styled from '@emotion/styled'
import { IconButton, IconButtonProps, SvgIconProps } from '@mui/material'
import React, { ComponentType, ReactElement } from 'react'

import Icon from './Icon'

type CustomIconButtonProps = IconButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    icon: string | ComponentType<SvgIconProps>
    ariaLabel: string
  }

const StyledIconButton = styled(IconButton)(() => ({
  '& svg': {
    width: 24,
    height: 24,
  },
}))

const CustomIconButton = ({ icon, ariaLabel, ...props }: CustomIconButtonProps): ReactElement => (
  <StyledIconButton aria-label={ariaLabel} {...props}>
    <Icon src={icon} color='inherit' />
  </StyledIconButton>
)

export default CustomIconButton
