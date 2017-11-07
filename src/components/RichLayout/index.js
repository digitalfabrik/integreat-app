import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { isEmpty } from 'lodash/lang'

import Layout from 'components/Layout'
import Header from './Header'
import Footer from './Footer'
import PAGE_ENDPOINT from '../../endpoints/page'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string,
    availableLanguages: PropTypes.arrayOf(PropTypes.shape({
      language: PropTypes.string.isRequired,
      pageId: PropTypes.number.isRequired
    })).isRequired
  }

  constructor (props) {
    super(props)

    this.gotoNewPath = this.gotoNewPath.bind(this)
  }

  /**
   * Builds the path to the location page in the new language or the root page if no location is given
   * @param newLanguage the new language
   * @returns {*} the path
   */
  getParentPath (newLanguage) {
    if (!this.props.location) {
      return '/'
    }
    return `/${this.props.location}/${newLanguage}`
  }

  /**
   * Builds the url to the page in the new language
   * @param newLanguage the new language
   * @returns {*} the url
   */
  getNewUrl (newLanguage) {
    if (!isEmpty(this.props.availableLanguages)) {
      return `/${this.props.location}/${newLanguage}/redirect/?id=${this.props.availableLanguages[newLanguage]}`
    }
    return this.getParentPath(newLanguage)
  }

  /**
   * Request fetching of the pages and loading of the current in the new language
   * @param newLanguage the new language
   */
  gotoNewPath (newLanguage) {
    this.props.dispatch(PAGE_ENDPOINT.requestAction({location: this.props.location, language: newLanguage}, {location: this.props.location}))
    this.props.dispatch(push(this.getNewUrl(newLanguage)))
  }

  render () {
    return (<div>
        <Header languageCallback={this.gotoNewPath}/>

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ location: state.router.params.location, availableLanguages: state.currentAvailableLanguages })

export default connect(mapStateToProps)(RichLayout)
