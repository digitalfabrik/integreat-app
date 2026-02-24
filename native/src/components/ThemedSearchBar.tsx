import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import testID from '../testing/testID'

const StyledBackground = styled(View)`
  background-color: ${props => props.theme.colors.background};
  flex: 1;
  height: 48px;
  margin: 4px;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
`

type ThemedSearchBarProps = {
  onChangeText: (text: string) => void
  value: string
  autofocus: boolean
}

const ThemedSearchBar = ({ onChangeText, value, autofocus }: ThemedSearchBarProps): ReactElement => {
  const { t } = useTranslation('search')
  const theme = useTheme()
  return (
    <StyledBackground>
      <TextInput
        mode='outlined'
        {...testID('Content-Search-Input')}
        role='searchbox'
        onChangeText={onChangeText}
        value={value}
        autoFocus={autofocus}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={theme.dark ? theme.colors.onSurface : theme.colors.onSurfaceVariant}
        right={
          value ? (
            <TextInput.Icon icon='close' onPress={() => onChangeText('')} accessibilityLabel={t('delete')} />
          ) : (
            <TextInput.Icon icon='magnify' accessible={false} focusable={false} />
          )
        }
        style={{ flex: 1, height: 48 }}
        outlineStyle={{ borderRadius: 24 }}
      />
    </StyledBackground>
  )
}

export default ThemedSearchBar
