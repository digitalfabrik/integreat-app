import { HeaderBackButton } from '@react-navigation/elements'
import * as React from 'react'
import { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import dimensions from '../constants/dimensions'
import ThemedSearchBar from './ThemedSearchBar'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`
const BoxShadow = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`
type SearchHeaderPropsType = {
  theme: ThemeType
  query: string
  closeSearchBar: (query: string) => void
  onSearchChanged: (query: string) => void
  t: TFunction<'search'>
}

const SearchHeader = ({ theme, query, closeSearchBar, onSearchChanged, t }: SearchHeaderPropsType): ReactElement => {
  const onClose = () => {
    closeSearchBar(query)
  }

  return (
    <BoxShadow theme={theme}>
      <HorizontalLeft theme={theme}>
        <HeaderBackButton onPress={onClose} labelVisible={false} />
        <ThemedSearchBar theme={theme} onChangeText={onSearchChanged} value={query} autofocus t={t} />
      </HorizontalLeft>
    </BoxShadow>
  )
}

export default SearchHeader
