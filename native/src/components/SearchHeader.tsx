import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import dimensions from '../constants/dimensions'
import HighlightBox from './HighlightBox'
import ThemedSearchBar from './ThemedSearchBar'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`
const BoxShadow = styled(HighlightBox)`
  height: ${dimensions.headerHeight}px;
`
type SearchHeaderProps = {
  theme: ThemeType
  query: string
  closeSearchBar: (query: string) => void
  onSearchChanged: (query: string) => void
  t: TFunction<'search'>
}

const SearchHeader = ({ theme, query, closeSearchBar, onSearchChanged, t }: SearchHeaderProps): ReactElement => {
  const onClose = () => closeSearchBar(query)

  return (
    <BoxShadow theme={theme}>
      <Horizontal theme={theme}>
        <HeaderBackButton onPress={onClose} labelVisible={false} tintColor={theme.colors.textColor} />
        <ThemedSearchBar theme={theme} onChangeText={onSearchChanged} value={query} autofocus t={t} />
      </Horizontal>
    </BoxShadow>
  )
}

export default SearchHeader
