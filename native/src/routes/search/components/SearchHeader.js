// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from 'build-configs/ThemeType'
import { HeaderBackButton } from '@react-navigation/stack'
import ThemedSearchBar from './ThemedSearchBar'
import type { TFunction } from 'react-i18next'
import dimensions from '../../../modules/theme/constants/dimensions'
import type { StyledComponent } from 'styled-components'

const HorizontalLeft: StyledComponent<{||}, ThemeType, *> = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const BoxShadow: StyledComponent<{||}, ThemeType, *> = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`

type PropsType = {|
  theme: ThemeType,
  query: string,
  closeSearchBar: () => void,
  onSearchChanged: (query: string) => void,
  t: TFunction
|}

const SearchHeader = ({ theme, query, closeSearchBar, onSearchChanged, t }: PropsType) => (
  <BoxShadow theme={theme}>
    <HorizontalLeft theme={theme}>
      <HeaderBackButton onPress={closeSearchBar} labelVisible={false} />
      <ThemedSearchBar theme={theme} onChangeText={onSearchChanged} value={query} autofocus t={t} />
    </HorizontalLeft>
  </BoxShadow>
)

export default SearchHeader
