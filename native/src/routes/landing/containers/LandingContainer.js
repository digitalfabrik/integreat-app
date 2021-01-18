// @flow

import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CityModel } from 'api-client'
import * as React from 'react'
import { connect } from 'react-redux'
import type {
  LandingRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import { DASHBOARD_ROUTE } from '../../../modules/app/constants/NavigationTypes'
import { cityContentUrl } from '../../../modules/common/url'

type OwnPropsType = {|
  route: RoutePropType<LandingRouteType>,
  navigation: NavigationPropType<LandingRouteType>
|}
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type ContainerPropsType = {|
  ...OwnPropsType,
  ...DispatchPropsType,
  language: string,
  cities: $ReadOnlyArray<CityModel>
|}

type StatePropsType = StatusPropsType<ContainerPropsType, $Shape<{||}>>

const refresh = (refreshProps: $Shape<{||}>, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'FETCH_CITIES', params: { forceRefresh: true } })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const language = state.contentLanguage
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps: {} }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }
  return {
    status: 'success',
    innerProps: {
      cities: state.cities.models,
      language,
      navigation: ownProps.navigation,
      route: ownProps.route
    },
    refreshProps: {}
  }
}

const ThemedTranslatedLanding = withTranslation('landing')(
  withTheme(Landing)
)

class LandingContainer extends React.Component<ContainerPropsType> {
  navigateToDashboard = (cityCode: string, languageCode: string) => {
    const { navigation } = this.props

    navigation.replace(
      DASHBOARD_ROUTE,
      {
        shareUrl: cityContentUrl({ cityCode, languageCode }),
        cityCode,
        languageCode
      }
    )
  }

  clearResourcesAndCache = () => this.props.dispatch({ type: 'CLEAR_RESOURCES_AND_CACHE' })

  render () {
    const { cities, language } = this.props

    return <ThemedTranslatedLanding cities={cities} language={language}
                                    navigateToDashboard={this.navigateToDashboard}
                                    clearResourcesAndCache={this.clearResourcesAndCache} />
  }
}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withPayloadProvider<ContainerPropsType, $Shape<{||}>, LandingRouteType>(refresh)(
    LandingContainer
  )
)
