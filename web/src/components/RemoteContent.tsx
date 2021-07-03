import React, { ReactNode, RefObject } from 'react'
import styled, { css } from 'styled-components'
import buildConfig from '../constants/buildConfig'

const SandBox = styled.div<{ centered: boolean }>`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => props.theme.fonts.contentFontSize};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  ${props =>
    props.centered &&
    css`
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

  & details > * {
    padding: 0 25px;
  }

  & details > summary {
    padding: 0;
  }

  & pre {
    overflow-x: auto;
  }
`

type PropsType = {
  dangerouslySetInnerHTML: {
    __html: string
  }
  onInternalLinkClick: (url: string) => void
  centered: boolean
}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

class RemoteContent extends React.Component<PropsType> {
  static defaultProps = {
    centered: false
  }

  sandBoxRef: RefObject<HTMLDivElement>

  handleClick = (event: MouseEvent): void => {
    // https://stackoverflow.com/a/1000606
    // $FlowFixMe
    event.preventDefault ? event.preventDefault() : (event.returnValue = false)
    const target: EventTarget | null = event.currentTarget

    if (target instanceof HTMLAnchorElement) {
      const href = target.href
      this.props.onInternalLinkClick(decodeURIComponent(new URL(decodeURIComponent(href)).pathname))
    }
  }

  constructor(props: PropsType) {
    super(props)
    this.sandBoxRef = React.createRef<HTMLDivElement>()
  }

  hijackATags(): void {
    if (!this.sandBoxRef.current) {
      return
    }
    const collection: HTMLCollectionOf<HTMLAnchorElement> = this.sandBoxRef.current.getElementsByTagName('a')
    Array.from(collection).forEach(node => {
      if (HIJACK.test(node.href)) {
        node.addEventListener('click', this.handleClick)
      }
    })
  }

  componentDidMount(): void {
    this.hijackATags()
  }

  componentDidUpdate(): void {
    this.hijackATags()
  }

  render(): ReactNode {
    return (
      <SandBox
        centered={this.props.centered}
        dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}
        ref={this.sandBoxRef}
      />
    )
  }
}

export default RemoteContent
