import React from 'react'
import PropTypes from 'prop-types'

import Caption from './Caption'
import RemoteContent from './RemoteContent'

class Page extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired
  }

  render () {
    return (
      <div>
        <Caption title={this.props.page.title}/>
        <RemoteContent dangerousHtmlContent={this.props.page.content}/>
      </div>
    )
  }
}

export default Page
