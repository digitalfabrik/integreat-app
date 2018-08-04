import React from 'react'
import PropTypes from 'prop-types'
import { H1 } from './Caption.styles'

// fixme: Caption is connected to redux state because of H1 -> not a plain old component

class Caption extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return (
      <H1>{this.props.title}</H1>
    )
  }
}

export default Caption
