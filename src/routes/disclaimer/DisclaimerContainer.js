// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { createDisclaimerEndpoint, PageModel, Payload } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type { StateType } from '../../modules/app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import { baseUrl } from '../../modules/endpoint/constants'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'

type OwnPropsType = {| navigation: NavigationScreenProp<*>, theme: ThemeType |}

type StatePropsType = {| city: string, language: string |}

type PropsType = {| ...OwnPropsType, ...StatePropsType |}

const mapStateToProps = (state: StateType): StatePropsType => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  return { city: state.cityContent.city, language: state.contentLanguage }
}

type DisclaimerPropsType = {|
  navigation: NavigationScreenProp<*>,
  city: string,
  language: string,
  theme: ThemeType
|}

type DisclaimerStateType = {|
  disclaimer: ?PageModel,
  error: ?Error
|}

class DisclaimerContainer extends React.Component<DisclaimerPropsType, DisclaimerStateType> {
  constructor (props: DisclaimerPropsType) {
    super(props)
    this.state = { disclaimer: null, error: null }
  }

  componentWillMount () {
    this.loadDisclaimer()
  }

  async loadDisclaimer () {
    const { city, language } = this.props
    const disclaimerEndpoint = createDisclaimerEndpoint(baseUrl)
    const payload: Payload<Array<PageModel>> = await (disclaimerEndpoint.request({ city, language }))

    if (payload.error) {
      this.setState(() => ({ error: payload.error, disclaimer: null }))
    } else {
      this.setState(() => ({ error: null, disclaimer: payload.data }))
    }
  }

  async tryAgain () {
    this.setState({ error: null, disclaimer: null })
    this.loadDisclaimer()
  }

  render () {
    const { theme, navigation, city, language } = this.props
    const { disclaimer, error } = this.state

    if (error) {
      return <FailureContainer error={error} tryAgain={this.tryAgain} />
    }

    if (!disclaimer) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <Disclaimer disclaimer={disclaimer} theme={theme} navigation={navigation} city={city} language={language} />
  }
}

export default withTheme(props => props.language)(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, null)(
    DisclaimerContainer
  ))
