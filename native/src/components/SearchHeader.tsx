import { HeaderBackButton } from '@react-navigation/elements'
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
}

const SearchHeader = ({ query, closeSearchBar, onSearchChanged }: SearchHeaderProps): ReactElement => {
  const theme = useTheme()
  return (
    <BoxShadow>
      <Horizontal>
        <HeaderBackButton
          onPress={() => closeSearchBar(query)}
          displayMode='minimal'
          tintColor={theme.legacy.colors.textColor}
        />
        <ThemedSearchBar onChangeText={onSearchChanged} value={query} autofocus />
      </Horizontal>
    </BoxShadow>
  )
}

export default SearchHeader
