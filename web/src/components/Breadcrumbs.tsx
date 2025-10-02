import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Box from '@mui/material/Box'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'

import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Icon from './base/Icon'
import Link from './base/Link'

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

  /* stylelint-disable-next-line selector-class-pattern */
  & li:has(.MuiIconButton-root) {
    overflow: visible;
    margin-top: 0;
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

const StyledIconButton = styled(IconButton)`
  white-space: nowrap;
  flex-shrink: 0;
  min-width: auto;
  margin-top: 0 !important;
  color: ${props => props.theme.palette.text.secondary};
`

type BreadcrumbsProps = {
  ancestorBreadcrumbs: BreadcrumbModel[]
  currentBreadcrumb: BreadcrumbModel
}

const getBreadcrumbs = (
  ancestorBreadcrumbs: BreadcrumbModel[],
  currentBreadcrumb: BreadcrumbModel,
): { breadcrumbs: BreadcrumbModel[]; collapsedBreadcrumbs: BreadcrumbModel[] } => {
  const allBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  const breadCrumbsLimit = 3 // with home included
  const lastTwoCrumbs = -2

  if (ancestorBreadcrumbs.length === 0) {
    return { breadcrumbs: [], collapsedBreadcrumbs: [] }
  }

  if (allBreadcrumbs.length <= breadCrumbsLimit) {
    return { breadcrumbs: allBreadcrumbs, collapsedBreadcrumbs: [] }
  }

  const home = allBreadcrumbs[0] as BreadcrumbModel
  const rest = allBreadcrumbs.slice(1)

  const ellipsis = new BreadcrumbModel({
    title: '...',
    pathname: '',
    node: null,
  })

  return {
    breadcrumbs: [home, ellipsis, ...rest.slice(lastTwoCrumbs)],
    collapsedBreadcrumbs: rest.slice(0, lastTwoCrumbs),
  }
}

const Breadcrumbs = ({ ancestorBreadcrumbs, currentBreadcrumb }: BreadcrumbsProps): ReactElement => {
  // The current page should not be listed in the UI, but should be within the JsonLd.
  const jsonLdBreadcrumbs = [...ancestorBreadcrumbs, currentBreadcrumb]
  // Min text length after which the last breadcrumb item should shrink
  const MIN_SHRINK_CHARS = 20

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const breadcrumbData = getBreadcrumbs(ancestorBreadcrumbs, currentBreadcrumb)

  return (
    <StyledBox>
      <JsonLdBreadcrumbs breadcrumbs={jsonLdBreadcrumbs} />
      <StyledMuiBreadcrumbs length={ancestorBreadcrumbs.length} aria-label='Breadcrumb' separator={<Separator />}>
        {breadcrumbData.breadcrumbs.map((breadcrumb, index, array) => {
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
              <StyledIconButton
                key='menu'
                size='small'
                onClick={handleMenuOpen}
                aria-label='Show collapsed breadcrumbs'>
                <MoreHorizIcon />
              </StyledIconButton>
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
        })}
      </StyledMuiBreadcrumbs>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {breadcrumbData.collapsedBreadcrumbs.map(item => (
          <MenuItem key={item.pathname} onClick={handleMenuClose}>
            <Link to={item.pathname}>{item.title}</Link>
          </MenuItem>
        ))}
      </Menu>
    </StyledBox>
  )
}

export default Breadcrumbs
