// @flow

import * as React from 'react'
import connect from 'react-redux/es/connect/connect'
import { Linking } from 'react-native'
import Extras from '../components/Extras'
import { TFunction, translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { createExtrasEndpoint, ExtraModel, Payload } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../theme/constants/theme'
import request from '../../endpoint/request'
import type { StateType } from '../../app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import { baseUrl } from '../../endpoint/constants'

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.cityContent.language
  if (!language) {
    throw new Error('Language not set for categories!')
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
  extras: Array<ExtraModel>
|}

class ExtrasContainer extends React.Component<PropsType, ExtrasStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {extras: []}
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

    this.setState(() => ({extras: payload.data}))
  }

  render () {
    const {theme, t} = this.props
    return <Extras extras={this.state.extras} navigateToExtra={this.navigateToExtra} theme={theme} t={t} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(ExtrasContainer)
