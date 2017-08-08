import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { connect } from 'react-redux'

import LANGUAGE_ENDPOINT from 'endpoints/language'

class LanguagesFetcher extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: this.props.location,
      language: this.props.language
    }))
  }

  render () {
    if (this.props.languagePayload.ready()) {
      return React.cloneElement(React.Children.only(this.props.children), {languages: this.props.languagePayload.data})
    } else {
      return <Spinner name='line-scale-party'/>
    }
  }
}

export default connect((state) => { return {languagePayload: state.languages, language: state.language.language} })(LanguagesFetcher)
