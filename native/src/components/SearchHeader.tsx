import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'
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
  const { t } = useTranslation('common')
  const theme = useTheme()
  return (
    <BoxShadow>
      <Horizontal>
        <Appbar.BackAction
          onPress={() => closeSearchBar(query)}
          accessibilityLabel={t('back')}
          style={{ backgroundColor: 'transparent' }}
          iconColor={theme.colors.onSurface}
        />
        <ThemedSearchBar onChangeText={onSearchChanged} value={query} autofocus />
      </Horizontal>
    </BoxShadow>
  )
}

export default SearchHeader
