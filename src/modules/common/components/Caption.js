// @flow
import React from 'react'
import { H1 } from './Caption.styles'

type PropsType = {
  title: string
}

class Caption extends React.Component<PropsType> {
  render () {
    return (
      <H1>{this.props.title}</H1>
    )
  }
}

export default Caption
