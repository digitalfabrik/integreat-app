import React, { ReactElement } from 'react'
import { View, Keyboard } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import testID from '../testing/testID'
import Icon from './base/Icon'
import Text from './base/Text'

const InputWrapper = styled.View`
  margin: 0 4px;
  flex-grow: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.onSurfaceVariant};
`

const StyledInput = styled.TextInput`
  color: ${props => props.theme.colors.onSurface};
`

const Wrapper = styled.View<{ space: boolean }>`
  flex-direction: row;
  ${props => (props.space ? 'margin: 50px 0;' : '')}
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.background};
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
        <Icon source='magnify' />
        <InputWrapper>
          <StyledInput
            {...testID('Search-Input')}
            multiline={false}
            autoFocus
            onBlur={Keyboard.dismiss}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            placeholder={placeholderText}
            aria-label={placeholderText}
            value={filterText}
            onChangeText={onFilterTextChange}
            role='searchbox'
          />
        </InputWrapper>
      </Wrapper>
      {!!description && (
        <Text variant='body3' style={{ paddingLeft: 28 }}>
          {description}
        </Text>
      )}
    </View>
  )
}

export default SearchInput
