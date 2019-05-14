// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import HeaderBackButton from 'react-navigation-stack/dist/views/Header/HeaderBackButton'
import { SearchBar } from 'react-native-elements'

const ThemedSearchBar = styled(SearchBar).attrs(props => ({
  containerStyle: {
    flexGrow: 1,
    backgroundColor: props.theme.colors.backgroundAccentColor,
    borderTopColor: props.theme.colors.backgroundAccentColor,
    borderBottomColor: props.theme.colors.backgroundAccentColor
  },
  inputContainerStyle: {
    backgroundColor: props.theme.colors.backgroundColor
  },
  inputStyle: {
    backgroundColor: props.theme.colors.backgroundColor
  }
}))``

const HorizontalLeft = styled.View`
  flex:1;
  flex-direction: row;
  align-items: center;
`

const BoxShadow = styled.View`
  elevation: 1;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${props => props.theme.dimensions.headerHeight};
`

type PropsType = {|
  theme: ThemeType,
  query: string,
  closeSearchBar: () => void,
  onSearchChanged: (query: string) => void
|}

class SearchActiveHeader extends React.Component<PropsType> {
  render () {
    const {theme, query, closeSearchBar, onSearchChanged} = this.props

    return (
      <>
        <BoxShadow theme={theme}>
          <HorizontalLeft theme={theme}>
            <HeaderBackButton theme={theme} onPress={closeSearchBar} />
            <ThemedSearchBar theme={theme} onChangeText={onSearchChanged} value={query} />
          </HorizontalLeft>
        </BoxShadow>
      </>
    )
  }
}

export default SearchActiveHeader
