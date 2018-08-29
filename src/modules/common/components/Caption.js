// @flow

import React from 'react'
import { H1 } from './Caption.styles'

type PropsType = {
  title: string,
  className?: string
}

class Caption extends React.Component<PropsType> {
  render () {
    const {title, className} = this.props
    return (
      <H1 className={className}>{title}</H1>
    )
  }
}

export default Caption
