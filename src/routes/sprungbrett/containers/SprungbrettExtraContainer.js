// @flow

import * as React from 'react'
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
import { ActivityIndicator } from 'react-native'

const mapStateToProps = (state: StateType, ownProps) => {
  const extras: Array<ExtraModel> = ownProps.navigation.getParam('extras')

  const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)

  return {
    sprungbrettExtra: sprungbrettExtra
  }
}

type PropsType = {|
  sprungbrettExtra: ?ExtraModel,
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
    const {sprungbrettExtra} = this.props

    if (!sprungbrettExtra) {
      this.setState(() => ({error: new Error('The Sprungbrett extra is not supported.'), jobs: null}))
      return
    }

    const payload: Payload<Array<ExtraModel>> = await request(createSprungbrettJobsEndpoint(sprungbrettExtra.path))

    if (payload.error) {
      this.setState(() => ({error: payload.error, jobs: null}))
      return
    }

    this.setState(() => ({error: null, jobs: payload.data}))
  }

  render () {
    const {sprungbrettExtra, t} = this.props
    const {jobs, error} = this.state

    if (error) {
      return error.message
    }

    if (!jobs) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <SprungbrettExtra sprungbrettExtra={sprungbrettExtra} sprungbrettJobs={jobs} t={t} />
  }
}

export default compose(
  connect(mapStateToProps),
  translate('sprungbrett')
)(SprungbrettExtraContainer)
