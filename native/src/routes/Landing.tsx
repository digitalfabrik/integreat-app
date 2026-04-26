import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BOTTOM_TAB_ROUTE, SUGGEST_TO_REGION_ROUTE, LandingRouteType } from 'shared'
import { CityModel } from 'shared/api'

import CitySelector from '../components/CitySelector'
import SuggestToRegionFooter from '../components/SuggestToRegionFooter'
import SwitchCmsUrlButton from '../components/SwitchCmsUrlButton'
import Text from '../components/base/Text'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadCities from '../hooks/useLoadCities'
import testID from '../testing/testID'
import dataContainer from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
import LoadingErrorHandler from './LoadingErrorHandler'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
  flex-grow: 1;
  gap: 16px;
`

type LandingProps = {
  navigation: NavigationProps<LandingRouteType>
}

const Landing = ({ navigation }: LandingProps): ReactElement => {
  const { data: cities, refresh, ...response } = useLoadCities()
  const { changeCityCode } = useContext(AppContext)
  const { t } = useTranslation('landing')

  // The cities are otherwise only updated by pull to refresh
  useEffect(refresh, [refresh])

  const navigateToDashboard = (city: CityModel) => {
    changeCityCode(city.code)
    navigation.reset({ index: 0, routes: [{ name: BOTTOM_TAB_ROUTE, params: {} }] })
  }

  const clearResourcesAndCache = useCallback(() => {
    dataContainer.clearInMemoryCache()
    dataContainer._clearOfflineCache().catch(reportError)
    refresh()
  }, [refresh])

  return (
    <LoadingErrorHandler {...response} refresh={refresh} scrollView>
      {cities && (
        <>
          <Wrapper {...testID('Landing-Page')}>
            <SwitchCmsUrlButton clearResourcesAndCache={clearResourcesAndCache} />
            <Text variant='h3'>{t('welcome', { appName: buildConfig().appName })}</Text>
            <Text variant='body2'>{t('welcomeInformation')}</Text>
            <CitySelector cities={cities} navigateToDashboard={navigateToDashboard} />
          </Wrapper>
          <SuggestToRegionFooter navigateToSuggestToRegion={() => navigation.navigate(SUGGEST_TO_REGION_ROUTE)} />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default Landing
