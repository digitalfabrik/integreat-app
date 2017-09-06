import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'

import Layout from 'components/Layout'
import { LanguageFetcher } from 'endpoints'
import Header from './Header'
import Navigation from 'Navigation'
import Footer from './Footer'

class HeaderAdapter extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return <Header
      languages={this.props.languages}
      languageCallback={this.props.languageCallback}
      currentLanguage={this.props.language}
      navigation={new Navigation(this.props.location, this.props.language)}
    />
  }
}

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
  }

  getParentPath (newLanguage) {
    return `/${newLanguage}/${this.props.location}/location`
  }

  gotoParent (newLanguage) {
    this.props.dispatch(push(this.getParentPath(newLanguage)))
  }

  render () {
    return (<div>
        <LanguageFetcher options={{}} hideError={true} hideSpinner={true}>
          <HeaderAdapter languageCallback={this.gotoParent} language={this.props.language}
                         location={this.props.location}/>
        </LanguageFetcher>

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer navigation={new Navigation(this.props.location, this.props.language)}/>
      </div>
    )
  }
}

/**
 * @param state The current app state
 * @returns {{languagePayload: Payload, language: string}} The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return {
    language: state.router.params.language
  }
}

export default connect(mapStateToProps)(RichLayout)
