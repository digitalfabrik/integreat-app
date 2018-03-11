import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

const H1 = styled.h1`
  margin: 25px 0;
  font-size: 2rem;
  text-align: center;
  
  @media ${props => props.theme.dimensions.smallViewport} {
    margin: 10px 0;
  }
`

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
