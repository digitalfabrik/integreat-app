import Dompurify from 'dompurify'
import React, { ReactElement, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { ExternalLinkIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import { helpers } from '../constants/theme'
import { addDoNotTrackParameter } from '../utils/doNotTrack'

const SandBox = styled.div<{ centered: boolean; smallText: boolean }>`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  display: flow-root; /* clearfix for the img floats */

  ${props => (props.centered ? 'text-align: center;' : '')}
  ${props => (props.centered ? 'list-style-position: inside;' : '')}
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;

    &.alignright {
      float: right;
    }

    &.alignleft {
      float: left;
    }

    &.aligncenter {
      display: block;
      margin: auto;
    }
  }

  figure {
    margin-inline-start: 0;
    text-align: center;
    margin: 15px auto;

    @media only screen and (width <= 640px) {
      width: 100% !important;
    }
  }

  figcaption {
    font-size: ${props => props.theme.fonts.hintFontSize};
    font-style: italic;
    padding: 0 15px;
  }

  table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of bad-formatted remote-content */
    overflow: auto;
  }

  tbody,
  thead {
    display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
  }

  tbody,
  thead,
  th,
  td {
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
  }

  a {
    overflow-wrap: break-word;
  }

  details > * {
    padding: 0 25px;
  }

  details > summary {
    padding: 0;
  }

  pre {
    overflow-x: auto;
  }

  .link-external {
    display: inline-flex;
    align-items: center;
  }

  .link-external::after {
    content: '';
    display: inline-block;
    background-image: url('${ExternalLinkIcon}');
    width: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
    height: ${props => (props.smallText ? helpers.adaptiveFontSize : props.theme.fonts.contentFontSize)};
    background-size: contain;
    vertical-align: middle;
    margin-left: 4px;
  }

  iframe {
    border: none;
    width: 100%;
  }
`

type RemoteContentProps = {
  html: string
  onInternalLinkClick: (url: string) => void
  centered?: boolean
  smallText?: boolean
}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const RemoteContent = ({
  html,
  onInternalLinkClick,
  centered = false,
  smallText = false,
}: RemoteContentProps): ReactElement => {
  const sandBoxRef = React.createRef<HTMLDivElement>()

  const handleClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault()
      const target = event.currentTarget

      if (target instanceof HTMLAnchorElement) {
        const href = target.href
        onInternalLinkClick(decodeURIComponent(new URL(decodeURIComponent(href)).pathname))
      }
    },
    [onInternalLinkClick],
  )

  useEffect(() => {
    if (!sandBoxRef.current) {
      return
    }
    const currentSandBoxRef = sandBoxRef.current
    const collection = currentSandBoxRef.getElementsByTagName('a')
    Array.from(collection).forEach(node => {
      if (HIJACK.test(node.href)) {
        node.addEventListener('click', handleClick)
      }
    })

    // Remove disallowed iframes from DOM and add do not track parameter for vimeo
    const iframes = currentSandBoxRef.getElementsByTagName('iframe')
    Array.from(iframes).forEach((iframe: HTMLIFrameElement) => {
      if (buildConfig().allowedIframeSources.some(source => iframe.src.indexOf(source) > 0)) {
        addDoNotTrackParameter(iframe)
      } else {
        currentSandBoxRef.removeChild(iframe)
      }
    })
  }, [html, handleClick, sandBoxRef])

  const dangerouslySetInnerHTML = {
    __html: Dompurify.sanitize(html, {
      ALLOWED_TAGS: ['iframe'],
      ADD_ATTR: ['allowfullscreen'],
    }),
  }

  return (
    <SandBox
      dir='auto'
      centered={centered}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      ref={sandBoxRef}
      smallText={smallText}
    />
  )
}

export default RemoteContent
