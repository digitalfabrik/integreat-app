// @flow

import * as React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import Helmet from 'modules/common/containers/Helmet'
import Spinner from 'react-spinkit'
import SprungbrettList from '../components/SprungbrettList'
import type { StateType } from 'modules/app/StateType'
import { connect } from 'react-redux'
import ExtraModel from 'modules/endpoint/models/ExtraModel'

type PropsType = {
  sprungbrettJobs?: Array<SprungbrettJobModel>,
  extra: ExtraModel,
  cityName: string
}

class SprungbrettExtra extends React.Component<PropsType> {
  render () {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const {sprungbrettJobs, extra, cityName} = this.props
    return (
      <React.Fragment>
          <Helmet title={`${extra.title} - ${cityName}`} />
          {sprungbrettJobs ? <SprungbrettList title={extra.title} jobs={sprungbrettJobs} /> : <LoadingSpinner />}
      </React.Fragment>
    )
  }
}
const mapStateTypeToProps = (state: StateType) => ({
  sprungbrettJobs: state.sprungbrettJobs.data
})

export default connect(mapStateTypeToProps)(SprungbrettExtra)
