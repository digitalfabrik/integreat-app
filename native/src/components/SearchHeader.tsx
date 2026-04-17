import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { SearchRouteType } from 'shared'

import { NavigationProps } from '../constants/NavigationTypes'
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
  navigation: NavigationProps<SearchRouteType>
  query: string
  onSearchChanged: (query: string) => void
}

const SearchHeader = ({ query, navigation, onSearchChanged }: SearchHeaderProps): ReactElement => {
  const { t } = useTranslation('common')
  const theme = useTheme()
  return (
    <BoxShadow>
      <Horizontal>
        <Appbar.BackAction
          onPress={navigation.goBack}
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
