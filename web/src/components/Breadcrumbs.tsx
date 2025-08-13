import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import Box from '@mui/material/Box'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Icon from './base/Icon'

const StyledBox = styled(Box)`
  margin: 10px 0;
  overflow: hidden;
  width: 100%;
  align-items: center;
`

const StyledMuiBreadcrumbs = styled(MuiBreadcrumbs)`
  & ol {
    flex-wrap: nowrap;
    overflow: hidden;
    align-items: flex-start;
  }

  & li {
    overflow: hidden;
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledLink = styled(Link)`
  margin-inline-end: 4px;
  flex-shrink: 0;
`

const Separator = styled('span')`
  &::before {
    color: ${props => props.theme.legacy.colors.textColor};
    font-size: 19px;
    content: ' > ';
  }
`

type BreadcrumbsProps = {
  ancestorBreadcrumbs: BreadcrumbModel[]
  currentBreadcrumb: BreadcrumbModel
}

const Breadcrumbs = ({ ancestorBreadcrumbs, currentBreadcrumb }: BreadcrumbsProps): ReactElement => {
  // The current page should not be listed in the UI, but should be within the JsonLd.
  const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  // Min text length after which the last breadcrumb item should shrink
  const MIN_SHRINK_CHARS = 20

  return (
    <StyledBox>
      <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
      <StyledMuiBreadcrumbs aria-label='breadcrumb' separator={<Separator />}>
        {ancestorBreadcrumbs.map((breadcrumb, index) => {
          if (ancestorBreadcrumbs.length > 1 && index === 0) {
            return (
              <StyledLink key={breadcrumb.pathname} to={breadcrumb.pathname}>
                <StyledIcon src={HomeOutlinedIcon} title={breadcrumb.title} />
              </StyledLink>
            )
          }
          return (
            <Breadcrumb
              title={breadcrumb.title}
              to={breadcrumb.pathname}
              shrink={breadcrumb.title.length >= MIN_SHRINK_CHARS}
              key={breadcrumb.title}
            />
          )
        })}
        {ancestorBreadcrumbs.length > 0 && (
          <Breadcrumb
            title={currentBreadcrumb.title}
            shrink={currentBreadcrumb.title.length >= MIN_SHRINK_CHARS}
            isCurrent
            key={currentBreadcrumb.title}
          />
        )}
      </StyledMuiBreadcrumbs>
    </StyledBox>
  )
}

export default Breadcrumbs
