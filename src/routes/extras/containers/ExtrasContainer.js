// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { RefreshControl, ScrollView } from 'react-native'
import Extras from '../components/Extras'
import { type TFunction, translate } from 'react-i18next'
import { CityModel, createExtrasEndpoint, ExtraModel, Payload } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { StateType } from '../../../modules/app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../../modules/common/constants'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {| city: string, language: string, cities: ?$ReadOnlyArray<CityModel> |}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType): StatePropsType => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  const cities: ?$ReadOnlyArray<CityModel> = state.cities.status !== 'ready' ? null : state.cities.models

  return {
    city: state.cityContent.city,
    language: state.contentLanguage,
    cities
  }
}

type ExtrasPropsType = {|
  navigation: NavigationScreenProp<*>,
  city: string,
  cities: ?Array<CityModel>,
  language: string,
  navigateToExtra: (path: string, isExternalUrl: boolean) => void,
  theme: ThemeType,
  t: TFunction
|}

type ExtrasStateType = {|
  extras: ?Array<ExtraModel>,
  error: ?Error,
  timeoutExpired: boolean
|}

class ExtrasContainer extends React.Component<ExtrasPropsType, ExtrasStateType> {
  constructor (props: ExtrasPropsType) {
    super(props)
    this.state = { extras: null, error: null, timeoutExpired: false }
  }

  componentWillMount () {
    this.loadExtras().catch(e => this.setState({ error: e }))
  }

  navigateToExtra = (path: string, isExternalUrl: boolean, postData: ?Map<string, string>) => {
    if (!this.props.navigation.push) {
      throw new Error('push is not defined on navigation')
    }
    if (isExternalUrl) {
      this.props.navigation.push('ExternalExtra', { url: path, postData })
    } else {
      const params = { city: this.props.city, extras: this.state.extras, offerHash: null }
      this.props.navigation.push(path, params)
    }
  }

  loadExtras = async () => {
    const { city, language } = this.props
    this.setState({ error: null, extras: null, timeoutExpired: false })
    setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)

    try {
      const apiUrl = determineApiUrl()
      const payload: Payload<Array<ExtraModel>> = await (createExtrasEndpoint(apiUrl).request({
        city,
        language
      }))

      if (payload.error) {
        this.setState({ error: payload.error, extras: null })
      } else {
        this.setState({ error: null, extras: payload.data })
      }
    } catch (e) {
      this.setState({ error: e, extras: null })
    }
  }

  render () {
    const { theme, t, cities, navigation, city, language } = this.props
    const { extras, error, timeoutExpired } = this.state

    if (error) {
      return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadExtras} refreshing={false} />}
                         contentContainerStyle={{ flexGrow: 1 }}>
        <FailureContainer errorMessage={error.message} tryAgain={this.loadExtras} />
      </ScrollView>
    }

    if (!extras || !cities) {
      return timeoutExpired
        ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        : null
    }

    return <ScrollView refreshControl={<RefreshControl onRefresh={this.loadExtras} refreshing={false} />}
                       contentContainerStyle={{ flexGrow: 1 }}>
      <Extras extras={extras} navigateToExtra={this.navigateToExtra} theme={theme} t={t} cities={cities}
              navigation={navigation} cityCode={city} language={language} />
    </ScrollView>
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  translate('extras')(
    withTheme(props => props.language)(
      ExtrasContainer
    )))
