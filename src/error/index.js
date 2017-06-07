import React from 'react'

import { history } from '../main'
import Layout from '../components/Layout'

import NAVIGATION from '../navigation'

class ErrorPage extends React.Component {
  componentDidMount () {

  }

  /**
   * Go back in history!!
   * @param event The click event
   */
  goBack = (event) => {
    event.preventDefault()
    history.goBack()
  }

  render () {
    return (
      <Layout navigation={NAVIGATION}>
        <a href="/" onClick={this.goBack}>Go back</a>
      </Layout>
    )
  }
}

export default ErrorPage
