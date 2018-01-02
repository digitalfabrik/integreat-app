import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'
import RemoteContent from 'modules/common/components/RemoteContent'

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <Caption title={this.props.title} />
        <RemoteContent dangerouslySetInnerHTML={{__html: this.props.content}} />
      </div>
    )
  }
}

export default Page
