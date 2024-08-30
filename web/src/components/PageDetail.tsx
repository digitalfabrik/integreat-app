import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Link from './base/Link'

const Identifier = styled.span`
  font-weight: 700;
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline;
`

type PageDetailProps = {
  identifier: string
  information: string
  path?: string | null
}

const PageDetail = ({ identifier, information, path }: PageDetailProps): ReactElement => (
  <div>
    <Identifier>{identifier}: </Identifier>
    {path ? <StyledLink to={path}>{information}</StyledLink> : <span>{information}</span>}
  </div>
)

export default PageDetail
