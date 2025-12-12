import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MuiBreadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import Breadcrumb, { BreadcrumbProps } from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Link from './base/Link'

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
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLButtonElement | null>(null)
  const { xsmall } = useDimensions()
  const { t } = useTranslation('common')

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => setMenuAnchorElement(event.currentTarget)
  const closeMenu = () => setMenuAnchorElement(null)

  const home = breadcrumbs[0]
  if (breadcrumbs.length <= 1 || !home) {
    return <JsonLdBreadcrumbs breadcrumbs={breadcrumbs} />
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
    <Stack paddingBlock={1} overflow='hidden'>
      <JsonLdBreadcrumbs breadcrumbs={breadcrumbs} />
      <StyledMuiBreadcrumbs aria-label='Breadcrumb' separator='>'>
        {collapseHomeButton ? null : homeButton}
        {hiddenBreadcrumbs.length > 0 && (
          <IconButton key='menu' onClick={openMenu} aria-label={t('showMore')} color='inherit'>
            <MoreHorizIcon />
          </IconButton>
        )}
        {visibleBreadcrumbs.map(breadcrumb => (
          <Breadcrumb key={breadcrumb.to} title={breadcrumb.title} to={breadcrumb.to} />
        ))}
        {/* The following `span` ensures that a separator is shown after the last element.
            This emphasizes that the last element is the parent of the current page. 
            Since we show the current page's title directly below the breadcrumb, we
            do not need to repeat it here. */}
        <span />
      </StyledMuiBreadcrumbs>
      <Menu anchorEl={menuAnchorElement} open={!!menuAnchorElement} onClose={closeMenu}>
        {collapseHomeButton ? (
          <MenuItem key={home.to} component={Link} to={home.to}>
            {home.title}
          </MenuItem>
        ) : null}
        {hiddenBreadcrumbs.map(item => (
          <MenuItem key={item.to} component={Link} to={item.to}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}

export default Breadcrumbs
