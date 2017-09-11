import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'

import Layout from 'components/Layout'
import { LanguageFetcher } from 'endpoints'
import Header from './Header'
import Navigation from 'Navigation'
import Footer from './Footer'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string,
    language: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
  }

  getParentPath (newLanguage) {
    if (!this.props.language) {
      return '/'
    }
    return `/${newLanguage}/${this.props.location}`
  }

  gotoParent (newLanguage) {
    this.props.dispatch(push(this.getParentPath(newLanguage)))
  }

  render () {
    return (<div>
        <Header languageCallback={this.gotoParent}/>

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer/>
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
