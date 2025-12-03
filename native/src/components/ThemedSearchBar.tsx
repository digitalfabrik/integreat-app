import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import testID from '../testing/testID'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

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

const StyledInput = styled(TextInput)`
  padding: 4px;
  flex: 1;
  color: ${props => props.theme.colors.onSurface};
  font-size: 18px;
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
      <Icon size={20} color={theme.colors.onSurfaceVariant} source='magnify' />
      <StyledInput
        {...testID('Content-Search-Input')}
        role='searchbox'
        onChangeText={onChangeText}
        value={value}
        autoFocus={autofocus}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={theme.legacy.isContrastTheme ? theme.colors.onSurface : theme.colors.onSurfaceVariant}
      />
      {!!value && (
        <IconButton
          icon={<Icon size={20} color={theme.colors.onSurfaceVariant} source='close' />}
          onPress={() => onChangeText('')}
          accessibilityLabel={t('delete')}
        />
      )}
    </StyledBackground>
  )
}

export default ThemedSearchBar
