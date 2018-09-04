import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const H1 = styled.Text`
  padding: 25px 0;
  font-size: 20px;
  text-align: center;
`

class Caption extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render () {
    return (
      <H1 style={this.props.style}>{this.props.title}</H1>
    )
  }
}

export default Caption
