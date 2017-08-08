import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import { LanguageFetcher } from 'components/Fetcher'
import Header from './Header'
import Navigation from 'Navigation'

class HeaderAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }

  render () {
    return <Header
      languages={this.props.languages}
      languageCallback={this.props.languageCallback}
      currentLanguage={this.props.language}
      navigation={new Navigation(this.props.location)}
    />
  }
}

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
  }

  gotoParent () {
    // history.push(this.getParentPath()) fixme
  }

  render () {
    return (<div>
        <LanguageFetcher location={this.props.location} hideError={true} hideSpinner={true}>
          <HeaderAdapter languageCallback={this.gotoParent} language={this.props.language} location={this.props.location}/>
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
    language: state.language.language
  })
}

export default connect(mapStateToProps)(RichLayout)
