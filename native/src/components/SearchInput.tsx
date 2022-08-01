import React, { ReactElement } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import testID from '../testing/testID'

export const Input = styled.TextInput`
  margin: 0 5px;
  flex-grow: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`
export const Wrapper = styled.View<{ space: boolean }>`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {
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
}: PropsType): ReactElement => {
  const theme = useTheme()

  return (
    <Wrapper space={spaceSearch}>
      <Icon name='search' size={30} color={theme.colors.textSecondaryColor} />
      <Input
        {...testID('Search-Input')}
        multiline={false}
        placeholderTextColor={theme.colors.textSecondaryColor}
        placeholder={placeholderText}
        aria-label={placeholderText}
        defaultValue={filterText}
        onChangeText={onFilterTextChange}
      />
    </Wrapper>
  )
}

export default SearchInput
