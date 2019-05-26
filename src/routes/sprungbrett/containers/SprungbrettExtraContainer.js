// @flow

import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { TFunction, translate } from 'react-i18next'
import SprungbrettExtra from '../components/SprungbrettExtra'
import compose from 'lodash/fp/compose'
import connect from 'react-redux/es/connect/connect'
import type { StateType } from '../../../modules/app/StateType'
import {
  createSprungbrettJobsEndpoint,
  ExtraModel,
  Payload,
  SprungbrettJobModel
} from '@integreat-app/integreat-api-client'
import request from '../../../modules/endpoint/request'
import { SPRUNGBRETT_EXTRA } from '../../extras/constants'
import Failure from '../../../modules/error/components/Failure'
import { withTheme } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const mapStateToProps = (state: StateType, ownProps) => {
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')

  const extra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)

  return {
    extra: extra
  }
}

type PropsType = {|
  extra: ?ExtraModel,
  theme: ThemeType,
  t: TFunction
|}

type SprungbrettStateType = {|
  jobs: ?Array<SprungbrettJobModel>,
  error: ?Error
|}

// HINT: If you are copy-pasting this container think about generalizing this way of fetching
class SprungbrettExtraContainer extends React.Component<PropsType, SprungbrettStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {jobs: null, error: null}
  }

  componentWillMount () {
    this.loadSprungbrett()
  }

  async loadSprungbrett () {
    const {extra} = this.props

    if (!extra) {
      this.setState(() => ({error: new Error('The Sprungbrett extra is not supported.'), jobs: null}))
      return
    }
    try {
      const payload: Payload<Array<ExtraModel>> = await request(createSprungbrettJobsEndpoint(extra.path))

      if (payload.error) {
        this.setState(() => ({error: payload.error, jobs: null}))
        return
      }

      this.setState(() => ({error: null, jobs: payload.data}))
    } catch (e) {
      this.setState(() => ({error: e, jobs: null}))
    }
  }

  render () {
    const {extra, t, theme} = this.props
    const {jobs, error} = this.state

    if (error) {
      return <Failure error={error} />
    }

    if (!jobs) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <SprungbrettExtra sprungbrettExtra={extra} sprungbrettJobs={jobs} t={t} theme={theme} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate('sprungbrett'),
  withTheme
)(SprungbrettExtraContainer)
