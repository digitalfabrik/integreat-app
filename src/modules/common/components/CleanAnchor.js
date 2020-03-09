// @flow

import * as React from 'react'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`

type PropsType = {|
  newTab?: boolean,
  href: string,
  children: React.Node,
  className?: string,
  title: string
|}

class CleanAnchor extends React.PureComponent<PropsType> {
  static defaultProps = {
    newTab: true
  }

  render () {
    const { newTab, href, children, className, title } = this.props

    if (newTab) {
      return <StyledAnchor className={className} href={href} title={title} target='_blank' rel='noreferrer'>
        {children}
      </StyledAnchor>
    } else {
      return <StyledAnchor className={className} href={href} title={title}>{children}</StyledAnchor>
    }
  }
}

export default CleanAnchor
