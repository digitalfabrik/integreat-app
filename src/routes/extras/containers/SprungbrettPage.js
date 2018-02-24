import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import { connect } from 'react-redux'
import SprungbrettTypeSelector from '../components/SprungbrettTypeSelector'
import compose from 'lodash/fp/compose'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)),
    jobType: PropTypes.string
  }

  getContent () {
    if (!this.props.jobType) {
      return <SprungbrettTypeSelector />
    } else if (this.props.jobType === 'apprenticeships') {
      return <SprungbrettList jobs={this.props.sprungbrett.filter(job => job.isApprenticeship)} />
    } else if (this.props.jobType === 'internships') {
      return <SprungbrettList jobs={this.props.sprungbrett.filter(job => !job.isApprenticeship)} />
    }
    // throw error
  }

  render () {
    return this.getContent()
  }
}

const mapStateToProps = (state) => ({
  jobType: state.router.params.jobType
})

export default compose(
  connect(mapStateToProps),
  withFetcher('sprungbrett')
)(SprungbrettPage)
