import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MuiBreadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import useJsonLd from '../hooks/useJsonLd'
import createJsonLdBreadcrumbs from '../utils/createJsonLdBreadcrumbs'
import Breadcrumb, { BreadcrumbProps } from './Breadcrumb'
import Link from './base/Link'
import Menu from './base/Menu'

const StyledMuiBreadcrumbs = styled(MuiBreadcrumbs)`
  .${breadcrumbsClasses.ol} {
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .${breadcrumbsClasses.separator} {
    margin: 0 4px;
  }

  .${breadcrumbsClasses.li} {
    overflow: hidden;
    flex: 1;
    max-width: max-content;
    transition: flex 0.4s linear;

    &:hover {
      flex: 3;
    }
  }
`

type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbProps[]
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps): ReactElement | null => {
  const { xsmall } = useDimensions()
  const { t } = useTranslation()

  const home = breadcrumbs[0]
  useJsonLd(createJsonLdBreadcrumbs(breadcrumbs))
  if (breadcrumbs.length <= 1 || !home) {
    return null
  }

  const breadcrumbsWithoutHomeAndCurrent = breadcrumbs.slice(1, -1)

  const maxVisible = xsmall ? 1 : 2
  const hiddenBreadcrumbs = breadcrumbsWithoutHomeAndCurrent.slice(0, -maxVisible)
  const visibleBreadcrumbs = breadcrumbsWithoutHomeAndCurrent.slice(-maxVisible)
  const collapseHomeButton = hiddenBreadcrumbs.length > 0 && xsmall

  const homeButton =
    breadcrumbsWithoutHomeAndCurrent.length > 0 ? (
      <IconButton key='home' component={Link} to={home.to} aria-label={home.title} color='inherit'>
        <HomeOutlinedIcon />
      </IconButton>
    ) : (
      <Breadcrumb title={home.title} to={home.to} startIcon={<HomeOutlinedIcon />} />
    )

  return (
    <Stack sx={{ paddingBlock: 1, overflow: 'hidden' }}>
      <StyledMuiBreadcrumbs aria-label='Breadcrumb' separator='>'>
        {collapseHomeButton ? null : homeButton}
        {hiddenBreadcrumbs.length > 0 && (
          <Menu icon={<MoreHorizIcon />} label={t($ => $.common.actions.showMore)} buttonColor='inherit'>
            {() => [
              collapseHomeButton ? (
                <MenuItem key={home.to} component={Link} to={home.to}>
                  {home.title}
                </MenuItem>
              ) : null,
              ...hiddenBreadcrumbs.map(item => (
                <MenuItem key={item.to} component={Link} to={item.to}>
                  {item.title}
                </MenuItem>
              )),
            ]}
          </Menu>
        )}
        {visibleBreadcrumbs.map(breadcrumb => (
          <Breadcrumb key={breadcrumb.to} title={breadcrumb.title} to={breadcrumb.to} />
        ))}
        {/* The following `span` ensures that a separator is shown after the last element.
            This emphasizes that the last element is the parent of the current page.
            Since we show the current page's title directly below the breadcrumb, we do not need to repeat it here. */}
        <span />
      </StyledMuiBreadcrumbs>
    </Stack>
  )
}

export default Breadcrumbs
