import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import Icon from './base/Icon'
import Link from './base/Link'

const Container = styled.div<{ withPadding?: boolean }>`
  display: flex;
  padding-inline-start: ${props => (props.withPadding ? '32px' : '0')};
`

const Identifier = styled.span`
  font-weight: 700;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  margin-inline-end: 8px;
`

type PageDetailProps = {
  identifier?: string
  icon?: string
  information: string
  path?: string | null
}

const PageDetail = ({ identifier, information, path, icon }: PageDetailProps): ReactElement => (
  <Container withPadding={!icon && !identifier}>
    {!!identifier && <Identifier>{identifier}: </Identifier>}
    {!!icon && <StyledIcon src={icon} title='' />}
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
