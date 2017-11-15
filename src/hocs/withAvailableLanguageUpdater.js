import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setLanguageChangeUrls } from 'actions'
import LanguageModel from 'endpoints/models/LanguageModel'
import withFetcher from 'endpoints/withFetcher'
import LANGUAGE_ENDPOINT from 'endpoints/language'

const mapStateToProps = (state) => ({location: state.router.params.location})

function withAvailableLanguageUpdater (mapLanguageToUrl) {
  return (WrappedComponent) => withFetcher(LANGUAGE_ENDPOINT)(connect(mapStateToProps)(class extends React.Component {
    static propTypes = {
      languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
      location: PropTypes.string
    }

    componentDidMount () {
      const urls = this.props.languages
        .reduce((accumulator, language) => (
          {
            ...accumulator,
            [language.code]: mapLanguageToUrl(this.props.location, language.code)
          }
        ), {})
      this.props.dispatch(setLanguageChangeUrls(urls))
    }

    componentWillUnmount () {
      this.props.dispatch(setLanguageChangeUrls({}))
    }

    render () {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent {...this.props} />
    }
  }))
}

export default withAvailableLanguageUpdater
