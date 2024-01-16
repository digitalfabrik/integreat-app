import React, { ChangeEvent, ReactElement } from 'react'
import styled from 'styled-components'

import { SearchIcon } from '../assets'
import Icon from './base/Icon'

const searchLogoWidth = '24px'

const Spacer = styled.div<{ space: boolean }>`
  ${props => props.space && 'margin: 15px 0;'}
`

const TextInput = styled.input.attrs({ type: 'text' })`
  inline-size: calc(100% - ${searchLogoWidth} - 5px);
  block-size: 25px;
  box-sizing: border-box;
  margin-inline-start: 5px;
  color: ${props => props.theme.colors.textColor};
  background: transparent;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  border-radius: 0;

  &:focus-visible {
    outline: none !important;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textColor};
  }
`

const Wrapper = styled.div`
  position: relative;
  inline-size: 100%;
  box-sizing: border-box;
  padding: 10px 10%;
  background-color: ${props => props.theme.colors.backgroundColor};
  display: flex;
  align-items: center;
`

const StyledIcon = styled(Icon)`
  inline-size: 20px;
  block-size: 20px;
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch?: boolean
  onClickInput?: () => void
}

const SearchInput = ({
  placeholderText,
  filterText,
  onClickInput,
  onFilterTextChange,
  spaceSearch = false,
}: SearchInputProps): ReactElement => {
  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (typeof event.target.value === 'string') {
      onFilterTextChange(event.target.value)
    }
  }

  return (
    <Spacer space={spaceSearch}>
      <Wrapper>
        <StyledIcon src={SearchIcon} />
        {/* eslint-disable-next-line styled-components-a11y/no-autofocus -- in a dedicated search modal autofocus is fine */}
        <TextInput
          placeholder={placeholderText}
          aria-label={placeholderText}
          defaultValue={filterText}
          onChange={handleFilterTextChange}
          onClick={onClickInput}
          autoFocus
        />
      </Wrapper>
    </Spacer>
  )
}

export default SearchInput
