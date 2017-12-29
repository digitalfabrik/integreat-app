import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Page from 'routes/categories/components/Page'
import PageModel from 'modules/endpoint/models/PageModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import DISCLAIMER_ENDPOINT from 'modules/endpoint/endpoints/disclaimer'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'

import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

class DisclaimerPage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.string.isRequired,
    disclaimer: PropTypes.instanceOf(PageModel).isRequired
  }

  mapLanguageToUrl = (language) => `/${this.props.location}/${language}/disclaimer`

  componentDidMount () {
    this.props.dispatch(setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages))
  }

  render () {
    return <Page page={this.props.disclaimer} />
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location
})

export default compose(
  withFetcher(DISCLAIMER_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT),
  connect(mapStateToProps)
)(DisclaimerPage)
