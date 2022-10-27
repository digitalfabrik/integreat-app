import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CityModel, LandingRouteType, CATEGORIES_ROUTE } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import withPayloadProvider, { StatusProps } from '../hocs/withPayloadProvider'
import navigateToCityNotCooperating from '../navigation/navigateToCityNotCooperating'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import Landing from './Landing'

type OwnProps = {
  route: RouteProps<LandingRouteType>
  navigation: NavigationProps<LandingRouteType>
}
type DispatchProps = {
  dispatch: Dispatch<StoreActionType>
}
type LandingContainerProps = OwnProps &
  DispatchProps & {
    language: string
    cities: Array<CityModel>
  }
type StateProps = StatusProps<LandingContainerProps, Record<string, never>>

const refresh = (refreshProps: Record<string, never>, dispatch: Dispatch<StoreActionType>) => {
  dispatch({
    type: 'FETCH_CITIES',
    params: {
      forceRefresh: true,
    },
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnProps): StateProps => {
  const language = state.contentLanguage

  if (state.cities.status === 'error') {
    return {
      status: 'error',
      message: state.cities.message,
      code: state.cities.code,
      refreshProps: {},
    }
  }

  if (state.cities.status === 'loading') {
    return {
      status: 'loading',
      progress: 0,
    }
  }

  return {
    status: 'success',
    innerProps: {
      cities: Array.from(state.cities.models),
      language,
      navigation: ownProps.navigation,
      route: ownProps.route,
    },
    refreshProps: {},
  }
}

const LandingContainer = ({ navigation, dispatch, cities, language, route: _route }: LandingContainerProps) => {
  const { changeCityCode } = useContext(AppContext)

  const navigateToDashboard = (cityCode: string) => {
    changeCityCode(cityCode)
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
  }

  const clearResourcesAndCache = () => {
    dispatch({
      type: 'CLEAR_RESOURCES_AND_CACHE',
    })
  }

  return (
    <Landing
      cities={cities}
      language={language}
      navigateToDashboard={navigateToDashboard}
      navigateToCityNotCooperating={() => navigateToCityNotCooperating({ navigation })}
      clearResourcesAndCache={clearResourcesAndCache}
    />
  )
}

export default connect(mapStateToProps)(
  // @ts-expect-error TODO: IGAPP-636
  withPayloadProvider<LandingContainerProps, Record<string, never>, LandingRouteType>(refresh, false)(LandingContainer)
)
