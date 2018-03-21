import React from 'react'
import PropTypes from 'prop-types'

import { SandBox } from './RemoteContent.styles'

class RemoteContent extends React.Component {
  static propTypes = {
    dangerouslySetInnerHTML: PropTypes.shape(
      PropTypes.shape({
        __html: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    centered: PropTypes.bool
  }

  render () {
    return <SandBox centered={this.props.centered}
                    dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML} />
  }
}

export default RemoteContent
