import ClearIcon from '@mui/icons-material/Clear'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { formHelperTextClasses } from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const StyledTextField = styled(TextField)`
  width: 100%;

  .${outlinedInputClasses.root} {
    border-radius: 24px;
    padding: 0 12px;
    height: 48px;
  }

  .${formHelperTextClasses.root} {
    margin-inline-start: 24px;
  }

  legend {
    letter-spacing: 0;
  }
`

type SearchInputProps = {
  id: string
  ariaLabel: string
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  onClickInput?: () => void
  description?: string
  autoFocus?: boolean
}

const SearchInput = ({
  id,
  ariaLabel,
  placeholderText,
  filterText,
  onClickInput,
  onFilterTextChange,
  description,
  autoFocus,
}: SearchInputProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <StyledTextField
      id={id}
      placeholder={placeholderText}
      aria-label={ariaLabel}
      value={filterText}
      helperText={description}
      onChange={event => onFilterTextChange(event.target.value)}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          ;(event.target as HTMLInputElement).blur()
        }
      }}
      onClick={onClickInput}
      autoFocus={autoFocus}
      slotProps={{
        input: {
          endAdornment: filterText ? (
            <InputAdornment position='start'>
              <IconButton onClick={() => onFilterTextChange('')} edge='end' size='small' aria-label={t('clearInput')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : (
            <InputAdornment position='start'>
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default SearchInput
