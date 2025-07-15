import styled from '@emotion/styled'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { helpers } from '../constants/theme'
import Icon from './base/Icon'

const Spacer = styled.div<{ space: boolean }>`
  ${props => props.space && 'margin: 16px 0;'}
`

const Wrapper = styled.div`
  gap: 4px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
  display: flex;
  align-items: center;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 10px 5%;
    justify-content: center;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledTextField = styled(TextField)`
  & [class*='MuiOutlinedInput-root'] {
    border-radius: 24px;
    padding: 0 12px;
    height: 48px;
  }
`

const Description = styled.div`
  background-color: ${props => props.theme.colors.backgroundColor};
  margin-top: 8px;
  margin-left: 24px;
  ${helpers.adaptiveFontSize};
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch?: boolean
  onClickInput?: () => void
  description?: string
  searchInputRef?: React.LegacyRef<HTMLDivElement>
}

const SearchInput = ({
  placeholderText,
  filterText,
  onClickInput,
  onFilterTextChange,
  spaceSearch = false,
  description,
  searchInputRef,
}: SearchInputProps): ReactElement => {
  const { t } = useTranslation('common')
  return (
    <Spacer space={spaceSearch} ref={searchInputRef}>
      <Wrapper>
        <Column>
          <StyledTextField
            placeholder={placeholderText}
            aria-label={placeholderText}
            value={filterText}
            onChange={event => onFilterTextChange(event.target.value)}
            onClick={onClickInput}
            autoFocus
            slotProps={{
              input: {
                endAdornment: filterText ? (
                  <InputAdornment position='start'>
                    <IconButton
                      onClick={() => onFilterTextChange('')}
                      edge='end'
                      size='small'
                      aria-label={t('clearInput')}>
                      <Icon src={HighlightOffIcon} />
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
          {!!description && <Description>{description}</Description>}
        </Column>
      </Wrapper>
    </Spacer>
  )
}

export default SearchInput
