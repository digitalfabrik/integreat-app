import CheckIcon from '@mui/icons-material/Check'
import Stack from '@mui/material/Stack'
import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const LOWEST_PADDING = 0.5
const SELECTED_INLINE_END_PADDING = 1.5

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.palette.primary.main,

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },

  '&:first-of-type': {
    borderTopLeftRadius: 64,
    borderBottomLeftRadius: 64,
  },

  '&:last-of-type': {
    borderTopRightRadius: 64,
    borderBottomRightRadius: 64,
  },

  [`&.${toggleButtonClasses.selected}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,

    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}))

const ToggleButtonContent = styled(Stack, {
  shouldForwardProp: prop => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  alignItems: 'center',
  minWidth: 0,
  gap: theme.spacing(1),
  paddingInlineStart: theme.spacing(selected ? 1 : 3),
  paddingInlineEnd: theme.spacing(selected ? SELECTED_INLINE_END_PADDING : 3),

  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(LOWEST_PADDING),
    paddingInlineStart: theme.spacing(selected ? LOWEST_PADDING : 2),
    paddingInlineEnd: theme.spacing(selected ? LOWEST_PADDING : 2),
  },
}))

type ToggleButtonGroupProps<T extends string> = {
  setValue: (T: T) => void
  options: T[]
  value: T
  getLabel: (value: T) => string
  className?: string
}

const ToggleTextButtonGroup = <T extends string>({
  setValue,
  value,
  options,
  getLabel,
  className,
}: ToggleButtonGroupProps<T>): ReactElement => (
  <ToggleButtonGroup
    size='small'
    value={value}
    exclusive
    onChange={(_, newValue: T | null) => setValue(newValue ?? value)}
    className={className}>
    {options.map(option => {
      const selected = option === value
      return (
        <StyledToggleButton key={option} value={option} sx={{ minWidth: 0 }}>
          <ToggleButtonContent direction='row' selected={selected}>
            {selected && <CheckIcon fontSize='small' />}
            <Typography variant='body2' noWrap sx={{ minWidth: 0 }}>
              {getLabel(option)}
            </Typography>
          </ToggleButtonContent>
        </StyledToggleButton>
      )
    })}
  </ToggleButtonGroup>
)

export default ToggleTextButtonGroup
