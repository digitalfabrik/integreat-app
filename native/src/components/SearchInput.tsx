import React, { ReactElement } from 'react'
import { Text, View, Keyboard } from 'react-native'
import { KeyboardExtendedInput } from 'react-native-external-keyboard'
import styled, { useTheme } from 'styled-components/native'

import { SearchIcon } from '../assets'
import testID from '../testing/testID'
import Icon from './base/Icon'

const InputWrapper = styled.View`
  margin: 0 4px;
  flex-grow: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

const StyledInput = styled(KeyboardExtendedInput)`
  color: ${props => props.theme.colors.textColor};
`

const Wrapper = styled.View<{ space: boolean }>`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Description = styled(Text)`
  width: fit-content;
  padding-left: 28px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

type SearchInputProps = {
  placeholderText: string
  filterText: string
  onFilterTextChange: (filterText: string) => void
  spaceSearch: boolean
  description?: string
}

const SearchInput = ({
  placeholderText,
  filterText,
  onFilterTextChange,
  spaceSearch = false,
  description,
}: SearchInputProps): ReactElement => {
  const theme = useTheme()

  return (
    <View>
      <Wrapper space={spaceSearch}>
        <Icon Icon={SearchIcon} />
        <InputWrapper>
          <StyledInput
            {...testID('Search-Input')}
            multiline={false}
            autoFocus
            onBlur={Keyboard.dismiss}
            placeholderTextColor={theme.colors.textSecondaryColor}
            placeholder={placeholderText}
            aria-label={placeholderText}
            value={filterText}
            onChangeText={onFilterTextChange}
            role='searchbox'
          />
        </InputWrapper>
      </Wrapper>
      {!!description && <Description>{description}</Description>}
    </View>
  )
}

export default SearchInput
