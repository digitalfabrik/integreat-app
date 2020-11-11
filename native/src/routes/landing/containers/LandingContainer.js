// @flow

import withTheme from '../../../modules/theme/hocs/withTheme'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import type { NavigationStackProp } from 'react-navigation-stack'
import { type NavigationReplaceAction, StackActions } from 'react-navigation'
import { generateKey } from '../../../modules/app/generateRouteKey'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import { CityModel } from 'api-client'
import * as React from 'react'
import { connect } from 'react-redux'

type ContainerPropsType = {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationStackProp<*>,
  language: string,
  cities: $ReadOnlyArray<CityModel>
|}

type OwnPropsType = {| navigation: NavigationStackProp<*>, t: void |}
type StatePropsType = StatusPropsType<ContainerPropsType, {}>
type DispatchPropsType = {|
  dispatch: Dispatch<StoreActionType>
|}

const refresh = (refreshProps: {}, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'FETCH_CITIES', params: { forceRefresh: true } })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const language = state.contentLanguage
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps: {} }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading' }
  }
  return {
    status: 'success',
    innerProps: { cities: state.cities.models, language, navigation: ownProps.navigation },
    refreshProps: {}
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({
  dispatch
})

const ThemedTranslatedLanding = withTranslation('landing')(
  withTheme(Landing)
)

class LandingContainer extends React.Component<ContainerPropsType> {
  navigateToDashboard = (cityCode: string, language: string) => {
    const { dispatch, navigation } = this.props
    const path = `/${cityCode}/${language}`
    const key: string = generateKey()

    // $FlowFixMe newKey missing in typedef
    const action: NavigationReplaceAction = StackActions.replace({
      routeName: 'Dashboard',
      params: {
        cityCode,
        sharePath: path,
        onRouteClose: () => dispatch({ type: 'CLEAR_CATEGORY', params: { key } })
      },
      newKey: key
    })

    // $FlowFixMe For some reason action is not allowed to be a StackAction
    navigation.navigate({
      routeName: 'CityContent',
      action: action
    })

    return dispatch({
      type: 'FETCH_CATEGORY',
      params: {
        city: cityCode,
        language,
        path,
        depth: 2,
        criterion: { forceUpdate: false, shouldRefreshResources: true },
        key
      }
    })
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

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withPayloadProvider<ContainerPropsType, {}>(refresh)(
    LandingContainer
  )
)
