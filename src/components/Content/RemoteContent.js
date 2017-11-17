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
    ).isRequired
  }

  render () {
    return <div className={cx(style.remoteContent, this.props.className)}
                dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML} />
  }
}

export default RemoteContent
