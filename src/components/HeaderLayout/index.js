import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Payload from 'endpoints/Payload'
import LANGUAGE_ENDPOINT from 'endpoints/language'

import { history } from 'main'

import Layout from 'components/Layout'
import EndpointFetcher from 'components/EndpointFetcher'
import Header from './Header'

class HeaderLayout extends React.Component {
  static propTypes = {
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.changeLanguage = this.changeLanguage.bind(this)
  }

  changeLanguage (code) {
    // Invalidate
    // this.props.dispatch(PAGE_ENDPOINT.invalidateAction()) //fixme
    // Go to back to parent page
    history.push(this.getParentPath())
    // Re-fetch
    this.fetchData(code)
  }

  getParentPath () {
    return '/location/' + this.props.location
  }

  render () {
    return (<div>
        <EndpointFetcher endpoint={LANGUAGE_ENDPOINT} urlOptions={{
          location: this.props.location,
          language: this.props.language
        }}
        />
        {this.props.languagePayload.data &&
        <Header
          languages={this.props.languagePayload.data}
          languageCallback={this.changeLanguage}
          currentLanguage={this.props.language}
        />
        }
        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>
      </div>
    )
  }
}
/**
 * @param state The current app state
 * @returns {{languagePayload: Payload, language: string}} The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    languagePayload: state.languages,
    language: state.language.language
  })
}

export default connect(mapStateToProps)(HeaderLayout)
