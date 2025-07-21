import styled from '@emotion/styled'
import { IconButton, IconButtonProps, SvgIconProps } from '@mui/material'
import React, { ComponentType, ReactElement } from 'react'

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

const CustomIconButton = ({ icon, ariaLabel, ...props }: CustomIconButtonProps): ReactElement => {
  const renderIcon = typeof icon === 'string' ? <img src={icon} alt={ariaLabel} /> : React.createElement(icon)

  return (
    <StyledIconButton aria-label={ariaLabel} {...props}>
      {renderIcon}
    </StyledIconButton>
  )
}

export default CustomIconButton
