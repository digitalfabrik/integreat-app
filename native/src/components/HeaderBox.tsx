import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { REGIONS_ROUTE } from 'shared'

import { ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../constants'
import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import { buildConfigAssets } from '../constants/buildConfig'
import HeaderTitle from './HeaderTitle'
import Icon from './base/Icon'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const StyledIcon = styled(Icon)`
  width: 70px;
  height: 50px;
`

type HeaderBackButtonProps = {
  goBack: () => void
}

export const HeaderBackButton = ({ goBack }: HeaderBackButtonProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Appbar.BackAction
      style={{ backgroundColor: 'transparent' }}
      onPress={goBack}
      accessibilityLabel={t($ => $.common.actions.back)}
      iconColor={theme.colors.onSurface}
    />
  )
}

type HeaderBoxProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
  goBack?: () => void
  regionName?: string
}

const HeaderBox = ({ route, navigation, goBack, regionName }: HeaderBoxProps): ReactElement => {
  // Save route/canGoBack to state to prevent it from changing during navigating which would lead to flickering of the title and back button
  const [previousRouteKey] = useState(() => {
    const { routes } = navigation.getState()
    return routes[routes.findIndex(navRoute => navRoute.key === route.key) - 1]?.key
  })
  const [previousRootRouteKey] = useState(() => {
    const rootState = navigation.getParent(ROOT_NAVIGATOR_ID)?.getState()
    return rootState?.routes[rootState.index - 1]?.key
  })

  const tabNavigationState = navigation.getParent(TAB_NAVIGATOR_ID)?.getState()
  const rootNavigationState = navigation.getParent(ROOT_NAVIGATOR_ID)?.getState()

  const previousRoute =
    navigation.getState().routes.find(route => route.key === previousRouteKey) ??
    rootNavigationState?.routes.find(route => route.key === previousRootRouteKey)

  const hasTabHistory = !!tabNavigationState && tabNavigationState.index > 0
  const hasRootHistory = !!rootNavigationState && rootNavigationState.index > 0
  const canGoBack = !!goBack || previousRoute !== undefined || hasRootHistory || hasTabHistory

  const regionsPath =
    !previousRoute && !hasRootHistory && route.name !== REGIONS_ROUTE
      ? () => navigation.navigate(REGIONS_ROUTE)
      : undefined

  const HeaderIcon = canGoBack ? (
    <HeaderBackButton goBack={goBack ?? navigation.goBack} />
  ) : (
    <StyledIcon icon={buildConfigAssets().AppIcon} />
  )

  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderTitle previousRoute={previousRoute} regionName={regionName} regionsPath={regionsPath} />
    </HorizontalLeft>
  )
}

export default HeaderBox
