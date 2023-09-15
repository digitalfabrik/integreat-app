import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { TextInput, View } from 'react-native'
import styled from 'styled-components'

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
  t: TFunction<'search'>
}

const ThemedSearchBar = ({ onChangeText, value, autofocus, t }: ThemedSearchBarProps): ReactElement => (
  <StyledBackground>
    <StyledIcon Icon={SearchIcon} />
    <StyledInput
      {...testID('Content-Search-Input')}
      accessibilityRole='search'
      onChangeText={onChangeText}
      value={value}
      autoFocus={autofocus}
      placeholder={t('searchPlaceholder')}
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

export default ThemedSearchBar
