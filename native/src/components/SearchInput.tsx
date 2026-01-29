import React, { ReactElement } from 'react'
import { View, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import testID from '../testing/testID'
import Text from './base/Text'

const InputWrapper = styled.View`
  margin: 0 4px;
  flex-grow: 1;
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
        <InputWrapper>
          <TextInput
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
            mode='outlined'
            outlineStyle={{ borderRadius: 24 }}
            style={{ height: 48 }}
            right={<TextInput.Icon icon='magnify' accessible={false} focusable={false} />}
          />
        </InputWrapper>
      </Wrapper>
      {!!description && (
        <Text variant='body2' style={{ paddingLeft: 28 }}>
          {description}
        </Text>
      )}
    </View>
  )
}

export default SearchInput
