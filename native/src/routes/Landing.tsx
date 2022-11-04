import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, CITY_NOT_COOPERATING_ROUTE, CityModel, LandingRouteType } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import Heading from '../components/Heading'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadCities from '../hooks/useLoadCities'
import testID from '../testing/testID'
import LoadingErrorHandler from './LoadingErrorHandler'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 20px;
  align-items: center;
  flex-grow: 1;
`

export type LandingProps = {
  route: RouteProps<LandingRouteType>
  navigation: NavigationProps<LandingRouteType>
}

const Landing = ({ navigation }: LandingProps): ReactElement => {
  const { data: cities, ...response } = useLoadCities()
  const { changeCityCode } = useContext(AppContext)
  const dispatch = useDispatch()

  const navigateToDashboard = (city: CityModel) => {
    changeCityCode(city.code)
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
  }

  // TODO IGAPP-636: Clear resourcesAndCache on cms change
  const clearResourcesAndCache = () => {
    dispatch({
      type: 'CLEAR_RESOURCES_AND_CACHE',
    })
  }

  return (
    <LoadingErrorHandler {...response} scrollView>
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
