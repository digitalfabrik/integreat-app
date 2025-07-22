import { IconButton, IconButtonProps, SvgIconProps } from '@mui/material'
import React, { ComponentType, ReactElement } from 'react'

import Icon from './Icon'

type CustomIconButtonProps = IconButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    icon: string | ComponentType<SvgIconProps>
    ariaLabel: string
    className?: string
    iconSize?: string | number
  }

const CustomIconButton = ({ icon, ariaLabel, className, iconSize, ...props }: CustomIconButtonProps): ReactElement => (
  <IconButton aria-label={ariaLabel} className={className} {...props}>
    <Icon src={icon} color='inherit' iconSize={iconSize} />
  </IconButton>
)

export default CustomIconButton
