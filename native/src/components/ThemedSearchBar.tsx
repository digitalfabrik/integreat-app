import * as React from 'react'
import { ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { SearchBar } from 'react-native-elements'

import { ThemeType } from 'build-configs'

import testID from '../testing/testID'

type PropsType = {
  theme: ThemeType
  onChangeText: (text: string) => void
  value: string
  autofocus: boolean
  t: TFunction<'search'>
}

class ThemedSearchBar extends React.Component<PropsType> {
  render(): ReactNode {
    const { theme, onChangeText, value, autofocus, t } = this.props
    const { colors } = theme
    return (
      <SearchBar
        {...testID('Content-Search-Input')}
        accessibilityRole='search'
        allowFontScaling={false}
        containerStyle={{
          flexGrow: 1,
          backgroundColor: colors.backgroundAccentColor,
          borderTopColor: colors.backgroundAccentColor,
          borderBottomColor: colors.backgroundAccentColor,
          padding: 4
        }}
        inputContainerStyle={{
          backgroundColor: colors.backgroundColor
        }}
        inputStyle={{
          backgroundColor: colors.backgroundColor
        }}
        // @ts-ignore on change text is currently not typed correctly
        onChangeText={onChangeText}
        value={value}
        autoFocus={autofocus}
        placeholder={t('searchPlaceholder')}
      />
    )
  }
}

export default ThemedSearchBar
