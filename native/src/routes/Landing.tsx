import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, CITY_NOT_COOPERATING_ROUTE, CityModel, LandingRouteType } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import Heading from '../components/Heading'
import { NavigationProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadCities from '../hooks/useLoadCities'
import testID from '../testing/testID'
import dataContainer from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
import LoadingErrorHandler from './LoadingErrorHandler'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 20px;
  align-items: center;
  flex-grow: 1;
`

type LandingProps = {
  navigation: NavigationProps<LandingRouteType>
}

const Landing = ({ navigation }: LandingProps): ReactElement => {
  const { data: cities, refresh, ...response } = useLoadCities()
  const { changeCityCode } = useContext(AppContext)

  useEffect(() => {
    if (navigation.canGoBack()) {
      // Update the available cities if navigating to the landing page
      refresh()
    }
  }, [navigation, refresh])

  const navigateToDashboard = (city: CityModel) => {
    changeCityCode(city.code)
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
  }

  const clearResourcesAndCache = useCallback(() => {
    dataContainer.clearInMemoryCache()
    dataContainer.clearOfflineCache().catch(reportError)
    refresh()
  }, [refresh])

  return (
    <LoadingErrorHandler {...response} refresh={refresh} scrollView>
      {cities && (
        <>
          <Wrapper {...testID('Landing-Page')}>
            <Heading clearResourcesAndCache={clearResourcesAndCache} />
            <CitySelector cities={cities} navigateToDashboard={navigateToDashboard} />
          </Wrapper>
          <CityNotCooperatingFooter
            navigateToCityNotCooperating={() => navigation.navigate(CITY_NOT_COOPERATING_ROUTE)}
          />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default Landing
