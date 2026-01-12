import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, CITY_NOT_COOPERATING_ROUTE, LandingRouteType } from 'shared'
import { CityModel } from 'shared/api'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import SwitchCmsUrlIcon from '../components/SwitchCmsUrlIcon'
import { NavigationProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadCities from '../hooks/useLoadCities'
import testID from '../testing/testID'
import dataContainer from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
import LoadingErrorHandler from './LoadingErrorHandler'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.background};
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

  // The cities are otherwise only updated by pull to refresh
  useEffect(refresh, [refresh])

  const navigateToDashboard = (city: CityModel) => {
    changeCityCode(city.code)
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
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
            <SwitchCmsUrlIcon clearResourcesAndCache={clearResourcesAndCache} />
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
