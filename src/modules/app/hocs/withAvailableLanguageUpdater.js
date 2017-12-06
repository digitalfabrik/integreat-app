import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setLanguageChangeUrls } from 'modules/app/actions/set-language'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LANGUAGE_ENDPOINT from 'modules/endpoint/endpoints/language'
import compose from 'redux/es/compose'

const mapStateToProps = (state) => ({location: state.router.params.location})

/**
 * A HOC to dispatch {@link setLanguageChangeUrls} actions automatically
 *
 * @param {function(string, string)} mapLanguageToUrl A function which maps location and language to a url
 * @returns {function(*)} The a function which taskes a component and returns a wrapped component
 */
function withAvailableLanguageUpdater (mapLanguageToUrl) {
  return WrappedComponent => {
    class AvailableLanguageUpdater extends React.Component {
      static propTypes = {
        /**
         * from withFetcher HOC which provides data from LANGUAGE_ENDPOINT
         */
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
    }

    return compose(
      withFetcher(LANGUAGE_ENDPOINT),
      connect(mapStateToProps)
    )(AvailableLanguageUpdater)
  }
}

export default withAvailableLanguageUpdater
