import React from 'react'

import Error from 'components/Error'
import RichLayout from 'components/RichLayout'

class ErrorPage extends React.Component {
  render () {
    if ('augsburg') {
      // Location can be undefined if the url does not contain a location
      return (
        <RichLayout location={'augsburg'}>
          <Error error="errors:page.notFound"/>
        </RichLayout>
      )
    } else {
      return <Error error="errors:page.notFound"/>
    }
  }
}

export default ErrorPage
