import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import Box from '@mui/material/Box'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import BreadcrumbModel from '../models/BreadcrumbModel'
import getBreadcrumbs from '../utils/getBreadcrumbs'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Icon from './base/Icon'

const StyledBox = styled(Box)`
  margin: 10px 0;
  overflow: hidden;
  width: 100%;
  align-items: center;
`

const StyledMuiBreadcrumbs = styled(MuiBreadcrumbs)<{ length: number }>`
  & ol {
    flex-wrap: nowrap;
    overflow: hidden;
    align-items: flex-start;
  }

  & li {
    overflow: hidden;

    &:first-of-type {
      overflow: visible;
    }

    /* Shrink last breadcrumb item more if it has more than 2 items on small screens to make previous items more readable */
    ${props => props.theme.breakpoints.down('sm')} {
      &:last-of-type {
        max-width: ${props => (props.length > 2 ? '100px' : 'none')};
      }
    }
  }

  & li:nth-of-type(even) {
    overflow: visible;
    flex-shrink: 0;
    min-width: 16px;
  }

  /* Collapsed MuiBreadcrumbs */
  /* stylelint-disable-next-line selector-class-pattern */
  & .MuiButtonBase-root {
    justify-self: center;
    margin-top: 5px;
  }

  & li:has([data-ellipsis]) {
    overflow: visible;
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledLink = styled(Link)`
  margin-inline-end: 4px;
  flex-shrink: 0;
  overflow: visible;
`

const Separator = styled('div')`
  &::before {
    color: ${props => props.theme.legacy.colors.textColor};
    font-size: 19px;
    content: ' > ';
  }
`

const StyledEllipsis = styled(Link)`
  white-space: nowrap;
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
  const MAX_BREADCRUMBS = 3

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  return (
    <StyledBox>
      <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
      <StyledMuiBreadcrumbs
        length={ancestorBreadcrumbs.length}
        aria-label='breadcrumb'
        separator={<Separator />}
        maxItems={isDesktop ? MAX_BREADCRUMBS : undefined}
        itemsBeforeCollapse={isDesktop ? 1 : undefined}
        itemsAfterCollapse={isDesktop ? 2 : undefined}>
        {getBreadcrumbs(ancestorBreadcrumbs, currentBreadcrumb, isDesktop, StyledEllipsis).map(
          (breadcrumb, index, array) => {
            const isHome = array.length > 1 && index === 0
            const isLast = index === array.length - 1

            if (isHome) {
              return (
                <StyledLink key={breadcrumb.pathname} to={breadcrumb.pathname}>
                  <StyledIcon src={HomeOutlinedIcon} title={breadcrumb.title} />
                </StyledLink>
              )
            }

            if (breadcrumb.title === '...') {
              return (
                <StyledEllipsis to={breadcrumb.pathname} key='ellipsis' data-ellipsis>
                  ...
                </StyledEllipsis>
              )
            }

            return (
              <Breadcrumb
                title={breadcrumb.title}
                to={breadcrumb.pathname}
                shrink={breadcrumb.title.length >= MIN_SHRINK_CHARS}
                isCurrent={isLast}
                key={breadcrumb.title}
              />
            )
          },
        )}
      </StyledMuiBreadcrumbs>
    </StyledBox>
  )
}

export default Breadcrumbs
