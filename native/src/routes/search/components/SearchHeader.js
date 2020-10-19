// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants'
import { HeaderBackButton } from 'react-navigation-stack'
import ThemedSearchBar from './ThemedSearchBar'
import type { TFunction } from 'react-i18next'

const HorizontalLeft = styled.View`
  flex:1;
  flex-direction: row;
  align-items: center;
`

const BoxShadow = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1.00px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${props => props.theme.dimensions.headerHeight}px;
`

type PropsType = {|
  theme: ThemeType,
  query: string,
  closeSearchBar: () => void,
  onSearchChanged: (query: string) => void,
  t: TFunction
|}

class SearchHeader extends React.Component<PropsType> {
  render () {
    const { theme, query, closeSearchBar, onSearchChanged, t } = this.props

    return (
      <>
        <BoxShadow theme={theme}>
          <HorizontalLeft theme={theme}>
            <HeaderBackButton theme={theme} onPress={closeSearchBar} />
            <ThemedSearchBar theme={theme} onChangeText={onSearchChanged} value={query} autofocus t={t} />
          </HorizontalLeft>
        </BoxShadow>
      </>
    )
  }
}

export default SearchHeader
