import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import SprungbrettList from '../components/SprungbrettList'
import { connect } from 'react-redux'
import SprungbrettSelector from '../components/SprungbrettSelector'
import compose from 'lodash/fp/compose'

import style from './SprungbrettPage.css'
import Failure from '../../../modules/common/components/Failure'
import LanguageModel from '../../../modules/endpoint/models/LanguageModel'
import setLanguageChangeUrls from '../../../modules/language/actions/setLanguageChangeUrls'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    sprungbrett: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired,
    type: PropTypes.string,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    setLanguageChangeUrls: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl(this.props.type), this.props.languages)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.type !== this.props.type) {
      this.props.setLanguageChangeUrls(this.mapLanguageToUrl(nextProps.type), this.props.languages)
    }
  }

  mapLanguageToUrl = type => language => (`/${this.props.location}/${language}/extras/sprungbrett/${type}`)

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
  }

  getContent () {
    const jobs = this.getJobs()
    return jobs
      ? <div className={style.container}>
          <SprungbrettSelector basePath={this.getBasePath()} type={this.props.type} />
          {<SprungbrettList jobs={this.getJobs()} />}
        </div>
      // todo translate
      : <Failure error={'This site does not exist'} />
  }

  render () {
    return this.getContent()
  }
}

const mapStateToProps = state => ({
  type: state.router.params.type,
  language: state.router.params.language,
  location: state.router.params.location
})

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('sprungbrett')
)(SprungbrettPage)
