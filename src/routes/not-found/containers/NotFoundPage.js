import React from 'react'

import Error from 'modules/common/containers/Error'

class NotFoundPage extends React.Component {
  render () {
    return <Error error="not-found:page.notFound"/>
  }
}

export default NotFoundPage
