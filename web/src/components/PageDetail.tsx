import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Identifier = styled.span`
  font-weight: 700;
`

type PropsType = {
  identifier: string
  information: string
}

const PageDetail = ({ identifier, information }: PropsType): ReactElement => (
  <div>
    <Identifier>{identifier}: </Identifier>
    <span>{information}</span>
  </div>
)

export default PageDetail
