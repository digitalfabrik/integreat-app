import { Chip, ChipOwnProps, Theme, useTheme } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Icon from './Icon'

type ChipButtonProps = {
  label: string
  icon?: string | ReactElement
  onClick?: () => void
  onDelete?: () => void
  closeButton?: boolean
  variant?: 'outlined' | 'grey' | 'primary'
} & Omit<ChipOwnProps, 'label' | 'icon' | 'variant'>

const getIconElement = (IconProp: undefined | string | ReactElement): ReactElement | undefined => {
  if (typeof IconProp === 'string') {
    return <Icon src={IconProp} />
  }
  return IconProp
}

const mapPropsToMuiChipProps = (props: ChipButtonProps, theme: Theme): ChipOwnProps => {
  const { variant, icon, ...rest } = props
  const iconElement = getIconElement(icon)
  const isContrastMode = theme.palette.mode === 'dark'
  if (variant === 'outlined') {
    return {
      variant: 'outlined',
      icon: iconElement,
      sx: {
        '.MuiChip-label': {
          color: isContrastMode ? theme.palette.neutral[50] : theme.palette.neutral[900],
        },
        '.MuiChip-icon, .MuiChip-deleteIcon': {
          color: isContrastMode ? theme.palette.neutral[50] : theme.palette.neutral[400],
        },
        borderColor: isContrastMode ? theme.palette.neutral[50] : theme.palette.neutral[400],
        backgroundColor: isContrastMode ? '#000' : theme.palette.neutral[50],
      },
      ...rest,
    }
  }

  if (variant === 'primary') {
    return {
      icon: iconElement,
      sx: {
        '.MuiChip-label': {
          color: isContrastMode ? theme.palette.neutral[1000] : theme.palette.neutral[50],
        },
        '.MuiChip-icon, .MuiChip-deleteIcon': {
          color: isContrastMode ? theme.palette.neutral[800] : theme.palette.neutral[50],
        },
        backgroundColor: isContrastMode ? theme.palette.quartary[50] : theme.palette.primary.main,
      },
      ...rest,
    }
  }

  return {
    variant: 'filled',
    icon: iconElement,
    sx: {
      backgroundColor: isContrastMode ? theme.palette.quartary[50] : theme.palette.neutral[100],
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

const ChipButton = (props: ChipButtonProps): ReactElement => {
  const theme = useTheme()
  return <Chip {...mapPropsToMuiChipProps(props, theme)} />
}

export default ChipButton
