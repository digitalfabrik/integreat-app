import React, { ReactElement } from 'react'
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

// TODO refactor anchor with new clean link component IGAPP-749
const PageDetail: React.FC<PropsType> = ({ identifier, information, link, linkLabel }: PropsType): ReactElement => (
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

export default PageDetail
