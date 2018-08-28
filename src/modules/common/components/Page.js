import React from 'react'
import PropTypes from 'prop-types'

import Caption from 'modules/common/components/Caption'

class Page extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <Caption title={this.props.title} />
      </div>
    )
  }
}

export default Page
