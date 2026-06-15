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
  justify-content: center;
  padding: 10px 0;
  background-color: ${props => props.theme.colors.background};
`

type SearchInputProps = {
  placeholderText?: string | undefined
  value: string
  setValue: (value: string) => void
  description?: string
  style?: StyleProp<ViewStyle>
}

const SearchInput = ({ placeholderText, value, setValue, description, style }: SearchInputProps): ReactElement => {
  const { t } = useTranslation('search')
  const theme = useTheme()

  return (
    <View style={style}>
      <InputWrapper>
        <TextInput
          {...testID('Search-Input')}
          multiline={false}
          autoFocus
          onBlur={Keyboard.dismiss}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          placeholder={placeholderText}
          aria-label={placeholderText}
          value={value}
          onChangeText={setValue}
          role='searchbox'
          mode='outlined'
          outlineStyle={{ borderRadius: 24 }}
          style={{ height: 48, backgroundColor: theme.colors.surfaceVariant }}
          textColor={theme.colors.onSurface}
          right={
            value ? (
              <TextInput.Icon
                icon='close'
                onPress={() => setValue('')}
                accessibilityLabel={t('delete')}
                color={theme.colors.onSurfaceVariant}
              />
            ) : (
              <TextInput.Icon
                icon='magnify'
                accessible={false}
                focusable={false}
                color={theme.colors.onSurfaceVariant}
              />
            )
          }
        />
      </InputWrapper>
      {!!description && (
        <Text variant='body3' style={{ paddingLeft: 28 }}>
          {description}
        </Text>
      )}
    </View>
  )
}

export default SearchInput
