import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import { StateType } from '../../../modules/app/StateType'
import { Dispatch } from 'redux'
import { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing, { PropsType as LandingPropsType } from '../components/Landing'
import withPayloadProvider, { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CityModel } from 'api-client'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import { DASHBOARD_ROUTE, LandingRouteType } from 'api-client/src/routes'
import navigateToCategory from '../../../modules/navigation/navigateToCategory'
import { cityContentPath } from '../../../modules/navigation/url'

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

const ThemedTranslatedLanding = withTranslation('landing')(withTheme<LandingPropsType>(Landing))

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
    <ThemedTranslatedLanding
      cities={cities}
      language={language}
      navigateToDashboard={navigateToDashboard}
      clearResourcesAndCache={clearResourcesAndCache}
    />
  )
}

export default connect(mapStateToProps)(
  // @ts-ignore
  withPayloadProvider<ContainerPropsType, Record<string, never>, LandingRouteType>(refresh)(LandingContainer)
)
