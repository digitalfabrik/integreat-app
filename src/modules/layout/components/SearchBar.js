// @flow

import * as React from 'react'
import { SearchBar as ReactNativeSearchBar } from 'react-native-elements'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const ThemedSearchBar = styled(ReactNativeSearchBar).attrs(props => ({
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

type PropsType = {|
  theme: ThemeType,
  onSearchChanged: (query: string) => void
|}

type StateType = {|
  query: string
|}

class SearchBar extends React.Component<PropsType, StateType> {
  constructor () {
    super()
    this.state = {
      query: ''
    }
  }

  onChangeText = (query: string) => {
    this.setState({
      query
    })
    this.props.onSearchChanged(query)
  }

  render () {
    const {theme} = this.props
    const {query} = this.state
    return <ThemedSearchBar theme={theme} onChangeText={this.onChangeText} value={query} />
  }
}

export default SearchBar
