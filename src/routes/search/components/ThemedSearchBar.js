// @flow

import * as React from 'react'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { SearchBar } from 'react-native-elements'

type PropsType = {|
  theme: ThemeType,
  onChangeText: (text: string) => void,
  value: string,
  autofocus: boolean
|}

class ThemedSearchBar extends React.Component<PropsType> {
  render () {
    const { theme, onChangeText, value, autofocus } = this.props
    const { colors } = theme

    return <SearchBar
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
    />
  }
}

export default ThemedSearchBar
