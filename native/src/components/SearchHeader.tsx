import { HeaderBackButton } from '@react-navigation/elements'
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  query: string
  closeSearchBar: (query: string) => void
  onSearchChanged: (query: string) => void
  t: TFunction<'search'>
}

const SearchHeader = ({ query, closeSearchBar, onSearchChanged, t }: SearchHeaderProps): ReactElement => {
  const theme = useTheme()
  const onClose = () => closeSearchBar(query)

  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBackButton onPress={onClose} labelVisible={false} tintColor={theme.colors.textColor} />
        <ThemedSearchBar onChangeText={onSearchChanged} value={query} autofocus t={t} />
      </Horizontal>
    </BoxShadow>
  )
}

export default SearchHeader
