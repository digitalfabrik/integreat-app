// @flow

import React from 'react'

import { SandBox } from './RemoteContent.styles'

type PropsType = {
  dangerouslySetInnerHTML: {
    __html: string
  },
  hijackRegExp: RegExp,
  onInternLinkClick: string => void,
  centered: boolean
}

const HIJACK = /https?:\/\/(cms\.integreat-app\.de|web\.integreat-app\.de|integreat\.app)(?!\/[^/]*\/(wp-content|wp-admin|wp-json)\/.*).*/

class RemoteContent extends React.Component<PropsType> {
  static defaultProps = {
    centered: false,
    hijackRegExp: HIJACK
  }

  sandBoxRef: { current: null | React$ElementRef<*> }

  handleClick = (event: MouseEvent) => {
    // https://stackoverflow.com/a/1000606
    event.preventDefault ? event.preventDefault() : ((event: any).returnValue = false)
    this.props.onInternLinkClick(new URL((event.currentTarget: any).href).pathname)
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
      if (this.props.hijackRegExp.test(node.href)) {
        node.addEventListener('click', this.handleClick)
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
