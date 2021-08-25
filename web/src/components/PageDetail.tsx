import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Identifier = styled.span`
  font-weight: 700;
`

type PropsType = {
  identifier: string
  information: string
  link?: string
  linkLabel?: string
}

class PageDetail extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { identifier, information, link, linkLabel } = this.props
    return (
      <div>
        <Identifier>{identifier}: </Identifier>
        <span>{information}</span>
        {link && (
          <p>
            <a href={link}>{linkLabel}</a>
          </p>
        )}
      </div>
    )
  }
}

export default PageDetail
