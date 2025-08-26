import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const Identifier = styled('span')`
  font-weight: 700;
`

type PageDetailProps = {
  identifier: string
  information: string
  path?: string | null
}

const PageDetail = ({ identifier, information, path }: PageDetailProps): ReactElement => (
  <div>
    <Identifier>{identifier}: </Identifier>
    {path ? (
      <Link to={path} highlighted>
        {information}
      </Link>
    ) : (
      <span>{information}</span>
    )}
  </div>
)

export default PageDetail
