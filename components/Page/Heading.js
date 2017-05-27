import React from 'react'
import PropTypes from 'prop-types'

class Heading extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return <div>{this.props.title}</div>
  }
}

export default Heading
