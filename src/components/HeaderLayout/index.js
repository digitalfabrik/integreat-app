import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import LanguageFetcher from 'components/Fetcher/LanguageFetcher'
import Header from './Header'

class HeaderAdapter extends React.Component {
  static propTypes = {

  }

  render () {
    return <Header
      languages={this.props.languagePayload.data}
      languageCallback={this.props.languageCallback}
      currentLanguage={this.props.language}
    />
  }
}

class HeaderLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.changeLanguage = this.changeLanguage.bind(this)
  }

  changeLanguage (code) {
    // Invalidate
    // this.props.dispatch(PAGE_ENDPOINT.invalidateAction()) //fixme
    // Go to back to parent page
    // history.push(this.getParentPath())
    // Re-fetch
    // this.fetchData(code)
  }

  render () {
    return (<div>
        <LanguageFetcher location={this.props.location}>
          <HeaderAdapter languageCallback={this.changeLanguage} language={this.props.language}/>
        </LanguageFetcher>

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
