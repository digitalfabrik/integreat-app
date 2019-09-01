// @flow

import withTheme from '../../../modules/theme/hocs/withTheme'
import { translate } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import Landing from '../components/Landing'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/error/hocs/withPayloadProvider'
import { CityModel } from '@integreat-app/integreat-api-client'
import * as React from 'react'
import { connect } from 'react-redux'
import omitNavigation from '../../../modules/common/hocs/omitNavigation'
import createNavigateToCityContent from '../../../modules/app/createNavigateToCityContent'

type ContainerPropsType = {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationScreenProp<*>,
  language: string,
  cities: Array<CityModel>
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}
type StatePropsType = StatusPropsType<ContainerPropsType, void>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const language = state.contentLanguage
  if (state.cities.errorMessage !== undefined) {
    return { status: 'error', refreshProps: undefined }
  }

  if (!state.cities.models) {
    return { status: 'loading' }
  }
  return {
    status: 'success',
    innerProps: { cities: state.cities.models, language, navigation: ownProps.navigation },
    refreshProps: undefined
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const ThemedTranslatedLanding = translate('landing')(
  withTheme(props => props.language)(
    Landing
  ))

class LandingContainer extends React.Component<ContainerPropsType> {
  navigateToDashboard = (cityCode: string, language: string) => {
    const navigateToCityContent = createNavigateToCityContent(this.props.dispatch)
    this.props.navigation.dispatch(navigateToCityContent({ cityCode, language, shouldRefreshResources: true }))
  }

  render () {
    const { cities, language } = this.props
    return <ThemedTranslatedLanding cities={cities} language={language}
                                    navigateToDashboard={this.navigateToDashboard} />
  }
}

const refresh = (refreshProps: void, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'FETCH_CITIES', params: { forceRefresh: true } })
}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  omitNavigation<PropsType>(
    withPayloadProvider<ContainerPropsType, void>(refresh)(
      LandingContainer
    ))
)
