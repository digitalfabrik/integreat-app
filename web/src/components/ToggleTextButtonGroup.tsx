import CheckIcon from '@mui/icons-material/Check'
import Stack from '@mui/material/Stack'
import ToggleButton, { toggleButtonClasses } from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.palette.primary.main,

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
    onChange={(_, value) => setValue(value ?? value)}
    className={className}>
    {options.map(option => {
      const selected = option === value
      const selectedInlineEndPadding = 1.5
      return (
        <StyledToggleButton key={option} value={option}>
          <Stack
            paddingInlineStart={selected ? 1 : 3}
            paddingInlineEnd={selected ? selectedInlineEndPadding : 3}
            direction='row'
            alignItems='center'
            gap={1}>
            {selected && <CheckIcon fontSize='small' />}
            <Typography variant='body2'>{getLabel(option)}</Typography>
          </Stack>
        </StyledToggleButton>
      )
    })}
  </ToggleButtonGroup>
)

export default ToggleTextButtonGroup
