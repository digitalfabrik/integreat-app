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
    location: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
  }

  getParentPath (newLanguage) {
    if (!this.props.location) {
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

function mapStateToProps (state) {
  return {
    location: state.router.params.location
  }
}

export default connect(mapStateToProps)(RichLayout)
