import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleProp, View, ViewStyle } from 'react-native'
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
  placeholderText?: string | undefined
  value: string
  onChangeText: (text: string) => void
  autoFocus?: boolean
  backgroundColor?: string
  clearable?: boolean
  description?: string
  placeholderTextColor?: string
  spaceSearch?: boolean
  style?: StyleProp<ViewStyle>
  testId?: string
  textColor?: string
}

const SearchInput = ({
  placeholderText,
  value,
  onChangeText,
  autoFocus = false,
  backgroundColor,
  clearable = false,
  spaceSearch = false,
  description,
  placeholderTextColor,
  style,
  testId = 'Search-Input',
  textColor,
}: SearchInputProps): ReactElement => {
  const { t } = useTranslation('search')
  const theme = useTheme()
  const currentPlaceholderTextColor = placeholderTextColor ?? theme.colors.onSurfaceVariant

  return (
    <View style={style}>
      <Wrapper space={spaceSearch}>
        <InputWrapper>
          <TextInput
            {...testID(testId)}
            multiline={false}
            autoFocus={autoFocus}
            onBlur={Keyboard.dismiss}
            placeholderTextColor={currentPlaceholderTextColor}
            placeholder={placeholderText}
            aria-label={placeholderText}
            value={value}
            onChangeText={onChangeText}
            role='searchbox'
            mode='outlined'
            outlineStyle={{ borderRadius: 24 }}
            style={[{ height: 48 }, backgroundColor ? { backgroundColor } : undefined]}
            textColor={textColor}
            right={
              clearable && value ? (
                <TextInput.Icon
                  icon='close'
                  onPress={() => onChangeText('')}
                  accessibilityLabel={t('delete')}
                  color={currentPlaceholderTextColor}
                />
              ) : (
                <TextInput.Icon
                  icon='magnify'
                  accessible={false}
                  focusable={false}
                  color={currentPlaceholderTextColor}
                />
              )
            }
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
