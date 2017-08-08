import React from 'react'

import Error from 'components/Error'
import HeaderLayout from 'components/HeaderLayout'

class ErrorPage extends React.Component {
  getLocation () {
    return this.props.match.params.location
  }

  render () {
    if (this.getLocation()) {
      // Location can be undefined if the url does not contain a location
      return (
        <HeaderLayout location={this.getLocation()}>
          <Error error="errors:page.notFound"/>
        </HeaderLayout>
      )
    } else {
      return <Error error="errors:page.notFound"/>
    }
  }
}

export default ErrorPage
