import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SearchIcon } from '../assets'
import testID from '../testing/testID'
import Icon from './base/Icon'

const Input = styled.TextInput`
  margin: 0 5px;
  flex-grow: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`
const Wrapper = styled.View<{ space: boolean }>`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch: boolean
}

const SearchInput = ({
  placeholderText,
  filterText,
  onFilterTextChange,
  spaceSearch = false,
}: SearchInputProps): ReactElement => {
  const theme = useTheme()

  return (
    <Wrapper space={spaceSearch}>
      <Icon Icon={SearchIcon} />
      <Input
        {...testID('Search-Input')}
        multiline={false}
        placeholderTextColor={theme.colors.textSecondaryColor}
        placeholder={placeholderText}
        aria-label={placeholderText}
        defaultValue={filterText}
        onChangeText={onFilterTextChange}
        role='searchbox'
      />
    </Wrapper>
  )
}

export default SearchInput
