import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './RemoteContent.css'

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
    const className = this.props.centered ? cx(style.remoteContent, style.centered) : style.remoteContent
    return <div className={className} dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML} />
  }
}

export default RemoteContent
