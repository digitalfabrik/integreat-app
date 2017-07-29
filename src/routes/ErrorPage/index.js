import React from 'react'

import Error from 'components/Error'
import PageLayout from 'components/PageLayout'

class ErrorPage extends React.Component {

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <PageLayout location={this.getLocation()}>
        <Error error="errors:page.notFound"/>
      </PageLayout>
    )
  }
}

export default ErrorPage
