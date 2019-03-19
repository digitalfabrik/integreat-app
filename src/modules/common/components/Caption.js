// @flow

import React from 'react'
import styled from 'styled-components/native'

const H1 = styled.Text`
  padding: 20px 0;
  font-size: 20px;
  text-align: center;
`
type PropsType = {|
  title: string,
  style?: string
|}

class Caption extends React.Component<PropsType> {
  render () {
    return (
      <H1 style={this.props.style}>{this.props.title}</H1>
    )
  }
}

export default Caption
