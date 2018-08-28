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

  sandBoxRef: { current: null | React$ElementRef<*> }

  handleClick = (event: SyntheticMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    this.props.onInternLinkClick(new URL(event.currentTarget.href).pathname)
  }

  constructor () {
    super()
    this.sandBoxRef = React.createRef<*>()
  }

  hijackATags () {
    if (!this.sandBoxRef.current) {
      return
    }
    const collection: HTMLCollection<HTMLAnchorElement> = this.sandBoxRef.current.getElementsByTagName('a')
    Array.from(collection).forEach(node => {
      if (this.props.hosts.includes(new URL(node.href).host)) {
        node.onclick = this.handleClick
      }
    })
  }

  componentDidMount () {
    this.hijackATags()
  }

  componentDidUpdate () {
    this.hijackATags()
  }

  render () {
    return <SandBox centered={this.props.centered}
                    dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}
                    innerRef={this.sandBoxRef} />
  }
}

export default RemoteContent
