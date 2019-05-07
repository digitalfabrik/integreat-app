// @flow

import * as React from 'react'
import connect from 'react-redux/es/connect/connect'
import { Linking, ActivityIndicator } from 'react-native'
import Extras from '../components/Extras'
import { TFunction, translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { createExtrasEndpoint, ExtraModel, Payload } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import request from '../../../modules/endpoint/request'
import type { StateType } from '../../../modules/app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import { baseUrl } from '../../../modules/endpoint/constants'

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.cityContent.language
  if (!language) {
    throw new Error('The state does not contain a language. Therefore it is not possible to open the extras!')
  }

  const targetCity: string = ownProps.navigation.getParam('cityCode')

  return {
    city: targetCity,
    language: language
  }
}

type PropsType = {|
  navigation: NavigationScreenProp<*>,
  city: string,
  language: string,
  navigateToExtra: (path: string, isExternalUrl: boolean) => void,
  theme: ThemeType,
  t: TFunction
|}

type ExtrasStateType = {|
  extras: ?Array<ExtraModel>,
  error: ?Error
|}

class ExtrasContainer extends React.Component<PropsType, ExtrasStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {extras: null, error: null}
  }

  componentWillMount () {
    this.loadExtras()
  }

  navigateToExtra = (path: string, isExternalUrl: boolean, offerHash: ?string = null) => {
    if (isExternalUrl) {
      Linking.openURL(path)
    } else if (this.props.navigation.push) {
      const params = {city: this.props.city, extras: this.state.extras, offerHash: offerHash}
      this.props.navigation.push(path, params)
    }
  }

  async loadExtras () {
    const {city, language} = this.props
    const payload: Payload<Array<ExtraModel>> = await request(createExtrasEndpoint(baseUrl), {city, language})

    if (payload.error) {
      this.setState(() => ({error: payload.error, extras: null}))
    } else {
      this.setState(() => ({error: null, extras: payload.data}))
    }
  }

  render () {
    const {theme, t} = this.props
    const {extras, error} = this.state

    if (error) {
      return error.message
    }

    if (!extras) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <Extras extras={extras} navigateToExtra={this.navigateToExtra} theme={theme} t={t} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(ExtrasContainer)
