// @flow

import * as React from 'react'
import type { ThemeType } from '../../../modules/theme/constants'
import { SearchBar } from 'react-native-elements'
import type { TFunction } from 'react-i18next'

type PropsType = {|
  theme: ThemeType,
  onChangeText: (text: string) => void,
  value: string,
  autofocus: boolean,
  t: TFunction
|}

class ThemedSearchBar extends React.Component<PropsType> {
  render() {
    const { theme, onChangeText, value, autofocus, t } = this.props
    const { colors } = theme

    return (
      <SearchBar
        accessibilityRole='search'
        allowFontScaling={false}
        containerStyle={{
          flexGrow: 1,
          backgroundColor: colors.backgroundAccentColor,
          borderTopColor: colors.backgroundAccentColor,
          borderBottomColor: colors.backgroundAccentColor
        }}
        inputContainerStyle={{
          backgroundColor: colors.backgroundColor
        }}
        inputStyle={{
          backgroundColor: colors.backgroundColor
        }}
        onChangeText={onChangeText}
        value={value}
        autoFocus={autofocus}
        placeholder={t('searchPlaceholder')}
      />
    )
  }
}

export default ThemedSearchBar
