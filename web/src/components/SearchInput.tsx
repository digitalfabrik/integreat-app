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

import Icon from './base/Icon'

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
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  onClickInput?: () => void
  description?: string
}

const SearchInput = ({
  placeholderText,
  filterText,
  onClickInput,
  onFilterTextChange,
  description,
}: SearchInputProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <StyledTextField
      placeholder={placeholderText}
      aria-label={placeholderText}
      value={filterText}
      helperText={description}
      onChange={event => onFilterTextChange(event.target.value)}
      onClick={onClickInput}
      autoFocus
      slotProps={{
        input: {
          endAdornment: filterText ? (
            <InputAdornment position='start'>
              <IconButton onClick={() => onFilterTextChange('')} edge='end' size='small' aria-label={t('clearInput')}>
                <Icon src={ClearIcon} />
              </IconButton>
            </InputAdornment>
          ) : (
            <InputAdornment position='start'>
              <Icon src={SearchOutlinedIcon} />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default SearchInput
