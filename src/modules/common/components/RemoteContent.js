// @flow

import React from 'react'

import { SandBox } from './RemoteContent.styles'

type PropsType = {
  dangerouslySetInnerHTML: {
    __html: string
  },
  centered: boolean
}

class RemoteContent extends React.Component<PropsType> {
  static defaultProps = {
    centered: false
  }

  render () {
    return <SandBox centered={this.props.centered}
                    dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML} />
  }
}

export default RemoteContent
