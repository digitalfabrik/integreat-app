import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './RemoteContent.css'

class RemoteContent extends React.Component {
  static propTypes = {
    dangerousHtmlContent: PropTypes.string.isRequired
  }

  render () {
    return <div className={cx(style.remoteContent, this.props.className)}
                dangerouslySetInnerHTML={{__html: (this.props.dangerousHtmlContent)}} />
  }
}

export default RemoteContent
