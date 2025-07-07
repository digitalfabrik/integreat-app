import styled from '@emotion/styled'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { TextField, IconButton, InputAdornment } from '@mui/material'
import React, { ChangeEvent, ReactElement } from 'react'

import Icon from './Icon'

const DEFAULT_MULTI_LINE_NUMBER = 7

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export type InputProps = {
  id: string
  value: string
  submitted?: boolean
  onChange: (input: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  multiline?: boolean
  numberOfLines?: number
  maxLength?: number
  required?: boolean
  hint?: string
  size?: 'small' | 'medium'
  label?: string
  autoFocus?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

const Input = ({
  id,
  onChange,
  onKeyDown,
  numberOfLines = DEFAULT_MULTI_LINE_NUMBER,
  value,
  submitted = false,
  multiline,
  maxLength,
  label,
  required,
  hint,
  size = 'small',
  autoFocus = false,
  onClick,
}: InputProps): ReactElement => {
  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const element = event.target
    if (element.validity.customError) {
      element.setCustomValidity('')
      element.checkValidity() // unset error
    }
    onChange(element.value)
  }
  return (
    <InputContainer>
      <TextField
        id={id}
        onClick={onClick}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={value}
        multiline={multiline}
        rows={numberOfLines}
        required={required}
        label={label}
        placeholder={label}
        size={size}
        variant='outlined'
        fullWidth
        helperText={hint}
        autoFocus={autoFocus}
        error={submitted && required && !value}
        slotProps={{
          htmlInput: {
            maxLength,
          },
          input: {
            endAdornment: value && (
              <InputAdornment position='end'>
                <IconButton onClick={() => onChange('')} edge='end' size='small' aria-label='clear input'>
                  <Icon src={HighlightOffIcon} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </InputContainer>
  )
}

export default Input
