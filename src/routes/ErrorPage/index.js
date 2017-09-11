import React from 'react'

import Error from 'components/Error'
import RichLayout from 'components/RichLayout'

class ErrorPage extends React.Component {
  render () {
    return <RichLayout>
      <Error error="errors:page.notFound"/>
    </RichLayout>
  }
}

export default ErrorPage
