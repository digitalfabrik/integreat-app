import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, SearchIcon } from '../assets'
import testID from '../testing/testID'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const StyledBackground = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  flex: 1;
  height: 48px;
  margin: 4px;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  height: 20px;
`

const StyledInput = styled(TextInput)`
  padding: 4px;
  flex: 1;
  color: ${props => props.theme.colors.textColor};
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
      <StyledIcon Icon={SearchIcon} />
      <StyledInput
        {...testID('Content-Search-Input')}
        role='searchbox'
        onChangeText={onChangeText}
        value={value}
        autoFocus={autofocus}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={theme.isContrastTheme ? theme.colors.textColor : theme.colors.textSecondaryColor}
      />
      {!!value && (
        <IconButton
          icon={<StyledIcon Icon={CloseIcon} />}
          onPress={() => onChangeText('')}
          accessibilityLabel={t('delete')}
        />
      )}
    </StyledBackground>
  )
}

export default ThemedSearchBar
