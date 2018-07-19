// @flow

import * as React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import Helmet from 'modules/common/containers/Helmet'
import Spinner from 'react-spinkit'
import SprungbrettList from '../components/SprungbrettList'
import type { StateType } from 'flowTypes'
import { connect } from 'react-redux'

type PropsType = {
  sprungbrettJobs: Array<SprungbrettJobModel>
}

class SprungbrettExtra extends React.Component<PropsType> {
  render () {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const jobs = this.props.sprungbrettJobs;
    return (
      <React.Fragment>
          <Helmet title={`${extra.title} - ${cityName}`} />
          {jobs ? <SprungbrettList title={extra.title} jobs={jobs} /> : <LoadingSpinner />}
      </React.Fragment>
    )
  }
}
const mapStateTypeToProps = (state: StateType) => ({
  sprungbrettJobs: state.sprungbrettJobs.data
})

export default connect(mapStateTypeToProps)(SprungbrettExtra)
