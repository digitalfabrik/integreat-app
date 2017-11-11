import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { isEmpty } from 'lodash/lang'

import Layout from 'components/Layout'
import Header from './Header'
import Footer from './Footer'

class RichLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  render () {
    return (<div>
        <Header />

        <Layout className={this.props.className}>
          {this.props.children}
        </Layout>

        <Footer/>
      </div>
    )
  }
}

export default RichLayout
