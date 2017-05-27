import React from 'react'
import PropTypes from 'prop-types'

import style from './Content.pcss'

class Content extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired
  }

  render () {
    /* We can insert our html here directly since we trust our backend cms */
    return <div key={this.props.page.id} className={style.remoteContent}
                dangerouslySetInnerHTML={{__html: (this.props.page.content)}}/>
  }
}

export default Content
