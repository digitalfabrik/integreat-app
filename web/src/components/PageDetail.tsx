import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Identifier = styled.span`
  font-weight: 700;
`

type PageDetailPropsType = {
  identifier: string
  information: string
}

const PageDetail = ({ identifier, information }: PageDetailPropsType): ReactElement => (
  <div>
    <Identifier>{identifier}: </Identifier>
    <span>{information}</span>
  </div>
)

export default PageDetail
