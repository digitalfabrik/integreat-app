import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'layout/Layout'

class SearchPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    return (
      <Layout>
      </Layout>
    )
  }
}

export default connect()(SearchPage)
