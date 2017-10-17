import React from 'react'
import PropTypes from 'prop-types'

import style from './Page.css'

class Page extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired
  }

  render () {
    /* We can insert our html here directly since we trust our backend cms */
    return (
      <div>
        <div className={style.remoteContent}
             dangerouslySetInnerHTML={{__html: (this.props.page.content)}}/>
      </div>
    )
  }
}

export default Page
