import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const Container = styled.div<{ withPadding?: boolean }>`
  display: flex;
  padding-inline-start: ${props => (props.withPadding ? '32px' : '0')};
`

const Identifier = styled.span`
  font-weight: 700;
`

type PageDetailProps = {
  identifier?: string
  icon?: ReactElement
  information: string
  path?: string | null
}

const PageDetail = ({ identifier, information, path, icon }: PageDetailProps): ReactElement => (
  <Container withPadding={!icon && !identifier}>
    {!!identifier && <Identifier>{identifier}: </Identifier>}
    {icon}
    {path ? (
      <Link to={path} highlighted>
        {information}
      </Link>
    ) : (
      <span>{information}</span>
    )}
  </Container>
)

export default PageDetail
