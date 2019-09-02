// @flow

import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { type TFunction, translate } from 'react-i18next'
import SprungbrettExtra from '../components/SprungbrettExtra'
import connect from 'react-redux/es/connect/connect'
import type { StateType } from '../../../modules/app/StateType'
import {
  createSprungbrettJobsEndpoint,
  ExtraModel,
  Payload,
  SprungbrettJobModel
} from '@integreat-app/integreat-api-client'
import { SPRUNGBRETT_EXTRA } from '../../extras/constants'
import Failure from '../../../modules/error/components/Failure'
import withTheme from '../../../modules/theme/hocs/withTheme'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {| extra: ?ExtraModel, language: string |}

type PropsType = { ...OwnPropsType, ...StatePropsType }

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')

  return {
    language: state.contentLanguage,
    extra: extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
  }
}

type SprungbrettPropsType = {|
  navigation: NavigationScreenProp<*>,
  extra: ?ExtraModel,
  language: string,
  theme: ThemeType,
  t: TFunction
|}

type SprungbrettStateType = {|
  jobs: ?Array<SprungbrettJobModel>,
  error: ?Error
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class SprungbrettExtraContainer extends React.Component<SprungbrettPropsType, SprungbrettStateType> {
  constructor (props: SprungbrettPropsType) {
    super(props)
    this.state = { jobs: null, error: null }
  }

  componentWillMount () {
    this.loadSprungbrett()
  }

  async loadSprungbrett () {
    const { extra } = this.props

    if (!extra) {
      this.setState(() => ({ error: new Error('The Sprungbrett extra is not supported.'), jobs: null }))
      return
    }
    try {
      const payload: Payload<Array<ExtraModel>> = await createSprungbrettJobsEndpoint(extra.path).request()

      if (payload.error) {
        this.setState(() => ({ error: payload.error, jobs: null }))
        return
      }

      this.setState(() => ({ error: null, jobs: payload.data }))
    } catch (e) {
      this.setState(() => ({ error: e, jobs: null }))
    }
  }

  render () {
    const { extra, t, theme, language } = this.props
    const { jobs, error } = this.state

    if (error) {
      return <Failure error={error} />
    }

    if (!jobs) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <SprungbrettExtra sprungbrettExtra={extra} sprungbrettJobs={jobs} t={t} theme={theme} language={language} />
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  translate('sprungbrett')(
    withTheme()(
      SprungbrettExtraContainer
    )))
