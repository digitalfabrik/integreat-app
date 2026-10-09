import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { SearchRouteType } from 'shared'

import { NavigationProps } from '../constants/NavigationTypes'
import { HeaderContainer } from './Header'
import SearchInput from './SearchInput'

const Horizontal = styled.View`
  background-color: ${props => props.theme.colors.surfaceVariant};
  flex: 1;
  flex-direction: row;
  align-items: center;
`

type SearchHeaderProps = {
  navigation: NavigationProps<SearchRouteType>
  query: string
  onSearchChanged: (query: string) => void
}

const SearchHeader = ({ query, navigation, onSearchChanged }: SearchHeaderProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <HeaderContainer>
      <Horizontal>
        <Appbar.BackAction
          accessibilityRole='button'
          onPress={navigation.goBack}
          accessibilityLabel={t($ => $.common.actions.back)}
          style={{ backgroundColor: 'transparent' }}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <SearchInput
          ariaLabel={t($ => $.search.searchContent)}
          setValue={onSearchChanged}
          value={query}
          placeholderText={t($ => $.search.searchContent)}
          style={{ flex: 1 }}
        />
      </Horizontal>
    </HeaderContainer>
  )
}

export default SearchHeader
