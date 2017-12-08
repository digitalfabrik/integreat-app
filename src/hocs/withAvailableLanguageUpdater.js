import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { isEmpty } from 'lodash/lang'

import { setLanguageChangeUrls } from 'actions'
import LanguageModel from 'endpoints/models/LanguageModel'
import withFetcher from 'endpoints/withFetcher'
import LANGUAGE_ENDPOINT from 'endpoints/language'

const mapStateToProps = (state) => ({
  location: state.router.params.location,
  route: state.router.route,
  availableLanguages: state.availableLanguages})

/**
 * A HOC to dispatch {@link setLanguageChangeUrls} actions automatically
 *
 * @param {function(string, string, string|undefined)} mapLanguageToUrl A function which maps location, language
 * and a optional id to a url
 * @returns {function(*)} The a function which takes a component and returns a wrapped component
 */
function withAvailableLanguageUpdater (mapLanguageToUrl) {
  return WrappedComponent => {
    class AvailableLanguageUpdater extends React.Component {
      static propTypes = {
        /**
         * from withFetcher HOC which provides data from LANGUAGE_ENDPOINT
         */
        languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
        location: PropTypes.string,
        availableLanguages: PropTypes.object
      }

      createUrls (availableLanguages) {
        if (!isEmpty(availableLanguages)) {
          // languageChange of a specific page/event with ids in availableLanguages
          return this.props.languages
            .reduce((accumulator, language) => ({
              ...accumulator,
              [language.code]: mapLanguageToUrl(
                  this.props.location,
                  language.code,
                  availableLanguages[language.code]
              )}), {})
        } else {
          //
          return this.props.languages
            .reduce((accumulator, language) => ({
              ...accumulator,
              [language.code]: mapLanguageToUrl(this.props.location, language.code, undefined)
            }), {})
        }
      }

      componentDidMount () {
        this.props.dispatch(setLanguageChangeUrls(this.createUrls(this.props.availableLanguages)))
      }

      componentWillUpdate (nextProps) {
        if (nextProps.availableLanguages !== this.props.availableLanguages) {
          this.props.dispatch(setLanguageChangeUrls(this.createUrls(nextProps.availableLanguages)))
        }
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
