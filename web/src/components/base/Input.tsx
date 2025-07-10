import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { TextField, IconButton, InputAdornment } from '@mui/material'
import React, { ChangeEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from './Icon'

export type InputProps = {
  id: string
  value: string
  submitted?: boolean
  onChange: (input: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  rows?: number
  maxLength?: number
  required?: boolean
  hint?: string
  label?: string
  placeholder?: string
  autoFocus?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

const Input = ({
  id,
  onChange,
  onKeyDown,
  value,
  submitted = false,
  rows = 1,
  maxLength,
  label,
  placeholder,
  required,
  hint,
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
  const { t } = useTranslation('common')
  return (
    <TextField
      id={id}
      onClick={onClick}
      onChange={onInputChange}
      onKeyDown={onKeyDown}
      value={value}
      multiline={rows !== 1}
      rows={rows}
      required={required}
      label={label}
      placeholder={placeholder}
      size='small'
      variant='outlined'
      fullWidth
      helperText={hint}
      autoFocus={autoFocus}
      error={submitted && required && !value}
      slotProps={{
        htmlInput: {
          maxLength,
        },
        inputLabel: {
          shrink: true,
        },
        input: {
          endAdornment: value && (
            <InputAdornment position='end'>
              <IconButton onClick={() => onChange('')} edge='end' size='small' aria-label={t('clearInput')}>
                <Icon src={HighlightOffIcon} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default Input
