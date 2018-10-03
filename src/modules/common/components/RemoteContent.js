// @flow

import React from 'react'

import styled, { css } from 'styled-components'

const SandBox = styled.div`
  font-family: ${props => props.theme.fonts.contentFontFamily};
  font-size: ${props => props.theme.fonts.contentFontSize};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  ${props => props.centered && css`
    text-align: center;
    list-style-position: inside;
  `}
  
  & img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  & table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of bad-formatted remote-content */
    overflow: auto;
  }
  
  & tbody,
  & thead {
    display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
  }

  & tbody,
  & thead,
  & th,
  & td {
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
  }
  
  & a {
    overflow-wrap: break-word;
  }
`

type PropsType = {
  dangerouslySetInnerHTML: {
    __html: string
  },
  hijackRegExp?: RegExp,
  onInternLinkClick: string => void,
  centered: boolean
}

const HIJACK = /https?:\/\/(cms\.integreat-app\.de|web\.integreat-app\.de|integreat\.app)(?!\/[^/]*\/(wp-content|wp-admin|wp-json)\/.*).*/

class RemoteContent extends React.Component<PropsType> {
  static defaultProps = {
    centered: false
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
      if ((this.props.hijackRegExp || HIJACK).test(node.href)) {
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
