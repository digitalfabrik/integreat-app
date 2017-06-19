import React from 'react'

import NAVIGATION from 'navigation'
import Payload from 'payload'
import Layout from 'components/Layout/Layout'
import Error from 'components/Error/Error'

class ErrorPage extends React.Component {
  render () {
    return (
      <Layout languageCallback={(code) => { /* todo */ }}
              languagePayload={new Payload()}
              navigation={NAVIGATION}>
        <Error error="errors:page.notFound"/>
      </Layout>
    )
  }
}

export default ErrorPage
