import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import { connect } from 'react-redux'
import SprungbrettTypeSelector from '../components/SprungbrettSelector'
import compose from 'lodash/fp/compose'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)),
    type: PropTypes.string,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  getBasePath () {
    return `/${this.props.location}/${this.props.language}/extras/sprungbrett`
  }

  getJobs () {
    const type = this.props.type
    const jobs = this.props.sprungbrett

    if (type === 'all') {
      return jobs
    } else if (type === 'apprenticeships') {
      return jobs.filter(job => job.isApprenticeship)
    } else if (type === 'employments') {
      return jobs.filter(job => job.isEmployment)
    }
    // todo throw
  }

  getContent () {
    return <div>
      <SprungbrettTypeSelector basePath={this.getBasePath()} type={this.props.type} />
      {<SprungbrettList jobs={this.getJobs()} />}
    </div>
  }

  render () {
    return this.getContent()
  }
}

const mapStateToProps = (state) => ({
  type: state.router.params.type,
  language: state.router.params.language,
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps),
  withFetcher('sprungbrett')
)(SprungbrettPage)
