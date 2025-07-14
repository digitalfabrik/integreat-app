import { Chip, ChipOwnProps, Theme, useTheme } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Icon from './Icon'

const sharedIconMargins = `
  .MuiChip-icon {
    margin-inline-start: 12px;
  }

  .MuiChip-deleteIcon {
    margin-inline-end: 12px;
  }
`

const ExtraSmallChip = styled(Chip)`
  ${sharedIconMargins}
  height: 20px;
  font-size: 10px;

  .MuiChip-icon,
  .MuiChip-deleteIcon {
    height: 10px;
    width: 10px;
  }
`

const SmallChip = styled(Chip)`
  ${sharedIconMargins}
  height: 24px;
  font-size: 12px;

  .MuiChip-icon,
  .MuiChip-deleteIcon {
    height: 12px;
    width: 12px;
  }
`

const MediumChip = styled(Chip)`
  ${sharedIconMargins}
  font-size: 14px;

  .MuiChip-icon,
  .MuiChip-deleteIcon {
    height: 14px;
    width: 14px;
  }
`

const getIconElement = (IconProp: undefined | string | ReactElement): ReactElement | undefined => {
  if (typeof IconProp === 'string') {
    return <Icon src={IconProp} />
  }
  return IconProp
}

const mapPropsToMuiChipProps = (props: ChipButtonProps, theme: Theme): ChipOwnProps => {
  const { variant, icon, size, ...rest } = props
  const iconElement = getIconElement(icon)
  if (variant === 'outlined') {
    return {
      variant: 'outlined',
      icon: iconElement,
      sx: {
        '.MuiChip-label': {
          color: theme.palette.neutral[900],
        },
        '.MuiChip-icon, .MuiChip-deleteIcon': {
          color: theme.palette.neutral[400],
        },
      },
      ...rest,
    }
  }
  if (variant === 'primary') {
    return {
      color: 'primary',
      icon: iconElement,
      sx: {
        '.MuiChip-label, .MuiChip-icon, .MuiChip-deleteIcon': {
          color: theme.palette.neutral[50],
        },
      },
      ...rest,
    }
  }
  return {
    variant: 'filled',
    icon: iconElement,
    sx: {
      '.MuiChip-label': {
        color: theme.palette.neutral[900],
      },
      '.MuiChip-icon, .MuiChip-deleteIcon': {
        color: theme.palette.neutral[600],
      },
    },
    ...rest,
  }
}

type ChipButtonProps = {
  label: string
  icon?: string | ReactElement
  onClick?: () => void
  onDelete?: () => void
  closeButton?: boolean
  size?: 'xs' | 'sm' | 'default'
  variant?: 'outlined' | 'grey' | 'primary'
}

const ChipButton = (props: ChipButtonProps): ReactElement => {
  const { size } = props
  const theme = useTheme()
  if (size === 'xs') {
    return <ExtraSmallChip {...mapPropsToMuiChipProps(props, theme)} />
  }
  if (size === 'sm') {
    return <SmallChip {...mapPropsToMuiChipProps(props, theme)} />
  }
  return <MediumChip {...mapPropsToMuiChipProps(props, theme)} />
}

export default ChipButton
