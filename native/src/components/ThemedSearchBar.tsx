import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { SearchBar } from 'react-native-elements'

import { ThemeType } from 'build-configs'

import testID from '../testing/testID'

type ThemedSearchBarProps = {
  theme: ThemeType
  onChangeText: (text: string) => void
  value: string
  autofocus: boolean
  t: TFunction<'search'>
}

const ThemedSearchBar = ({
  theme: { colors },
  onChangeText,
  value,
  autofocus,
  t,
}: ThemedSearchBarProps): ReactElement => (
  <SearchBar
    {...testID('Content-Search-Input')}
    accessibilityRole='search'
    allowFontScaling={false}
    style={{ color: colors.textColor }}
    containerStyle={{
      flexGrow: 1,
      backgroundColor: colors.backgroundAccentColor,
      borderTopColor: colors.backgroundAccentColor,
      borderBottomColor: colors.backgroundAccentColor,
      padding: 4,
    }}
    inputContainerStyle={{
      backgroundColor: colors.backgroundColor,
    }}
    inputStyle={{
      backgroundColor: colors.backgroundColor,
    }}
    // @ts-expect-error on change text is currently not typed correctly
    onChangeText={onChangeText}
    value={value}
    autoFocus={autofocus}
    placeholder={t('searchPlaceholder')}
  />
)

export default ThemedSearchBar
