import React from 'react'

import Error from 'components/Error'
import HeaderLayout from 'components/HeaderLayout'

class ErrorPage extends React.Component {

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <HeaderLayout location={this.getLocation()}>
        <Error error="errors:page.notFound"/>
      </HeaderLayout>
    )
  }
}

export default ErrorPage
