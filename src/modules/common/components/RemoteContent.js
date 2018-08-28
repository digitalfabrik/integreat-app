// @flow

import React from 'react'

import { SandBox } from './RemoteContent.styles'

type PropsType = {
  dangerouslySetInnerHTML: {
    __html: string
  },
  hosts: Array<string>,
  onInternLinkClick: string => void,
  centered: boolean
}

class RemoteContent extends React.Component<PropsType> {
  static defaultProps = {
    centered: false,
    hosts: ['cms.integreat-app.de', 'web.integreat-app.de']
  }

  sandBoxRef: any

  handleClick = event => {
    event.preventDefault()
    console.log(event)
    this.props.onInternLinkClick(new URL(event.target.href).pathname)
  }

  constructor () {
    super()
    this.sandBoxRef = React.createRef()
  }

  hijackATags () {
    console.log(this.sandBoxRef)
    const nodelist: HTMLCollection<> = this.sandBoxRef.current.getElementsByTagName('a')
    for (let i = 0; i < nodelist.length; i++) {
      const node = nodelist.item(i)
      if (this.props.hosts.includes(new URL(node.href).host)) {
        node.onclick = this.handleClick
      }
    }
  }

  componentDidMount () {
    this.hijackATags()
  }

  componentDidUpdate () {
    this.hijackATags()
  }

  render (): React.Node {
    return <SandBox centered={this.props.centered}
                    dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}
                    innerRef={this.sandBoxRef} />
  }
}

export default RemoteContent
