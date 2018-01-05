import React from 'react'

import Error from 'modules/common/components/Error'

class NotFoundPage extends React.Component {
  render () {
    return <Error error="not-found:page.notFound"/>
  }
}

export default NotFoundPage
