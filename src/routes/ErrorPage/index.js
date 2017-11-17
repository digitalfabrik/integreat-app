import React from 'react'

import Error from 'components/Error'

class ErrorPage extends React.Component {
  render () {
    return <Error error="errors:page.notFound"/>
  }
}

export default ErrorPage
