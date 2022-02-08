import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { CityModel, cityContentPath, DASHBOARD_ROUTE, LandingRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withPayloadProvider, { StatusPropsType } from '../hocs/withPayloadProvider'
import navigateToCategory from '../navigation/navigateToCategory'
import navigateToCityNotCooperating from '../navigation/navigateToCityNotCooperating'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import Landing from './Landing'

type OwnPropsType = {
  route: RoutePropType<LandingRouteType>
  navigation: NavigationPropType<LandingRouteType>
}
type DispatchPropsType = {
  dispatch: Dispatch<StoreActionType>
}
type ContainerPropsType = OwnPropsType &
  DispatchPropsType & {
    language: string
    cities: Array<CityModel>
  }
type StatePropsType = StatusPropsType<ContainerPropsType, Record<string, never>>

const refresh = (refreshProps: Record<string, never>, dispatch: Dispatch<StoreActionType>) => {
  dispatch({
    type: 'FETCH_CITIES',
    params: {
      forceRefresh: true
    }
  })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const language = state.contentLanguage

  if (state.cities.status === 'error') {
    return {
      status: 'error',
      message: state.cities.message,
      code: state.cities.code,
      refreshProps: {}
    }
  }

  if (state.cities.status === 'loading') {
    return {
      status: 'loading',
      progress: 0
    }
  }

  return {
    status: 'success',
    innerProps: {
      cities: Array.from(state.cities.models),
      language,
      navigation: ownProps.navigation,
      route: ownProps.route
    },
    refreshProps: {}
  }
}

const LandingContainer = ({ navigation, dispatch, cities, language }: ContainerPropsType) => {
  const navigateToDashboard = (cityCode: string, languageCode: string) => {
    navigateToCategory({
      routeName: DASHBOARD_ROUTE,
      navigation,
      dispatch,
      cityCode,
      languageCode,
      cityContentPath: cityContentPath({
        cityCode,
        languageCode
      }),
      forceRefresh: false,
      resetNavigation: true
    })
  }

  const clearResourcesAndCache = () => {
    dispatch({
      type: 'CLEAR_RESOURCES_AND_CACHE'
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
  // @ts-expect-error
  withPayloadProvider<ContainerPropsType, Record<string, never>, LandingRouteType>(refresh, false)(LandingContainer)
)
