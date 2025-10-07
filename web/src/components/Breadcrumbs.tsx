import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MuiBreadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import IconButton, { iconButtonClasses } from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import BreadcrumbModel from '../models/BreadcrumbModel'
import Breadcrumb from './Breadcrumb'
import JsonLdBreadcrumbs from './JsonLdBreadcrumbs'
import Link from './base/Link'

const StyledMuiBreadcrumbs = styled(MuiBreadcrumbs)`
  .${breadcrumbsClasses.ol} {
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .${breadcrumbsClasses.li} {
    overflow: hidden;

    &:first-of-type {
      overflow: visible;
    }

    ${props => props.theme.breakpoints.between('sm', 'md')} {
      &:last-of-type {
        max-width: 50%;
      }
    }
  }

  & li:has(.${iconButtonClasses.root}) {
    overflow: visible;
  }
`

type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbModel[]
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps): ReactElement | null => {
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLButtonElement | null>(null)
  const { xsmall } = useDimensions()
  const { t } = useTranslation('common')

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => setMenuAnchorElement(event.currentTarget)
  const closeMenu = () => setMenuAnchorElement(null)

  const maxVisible = xsmall ? 1 : 2
  const [home, ...rest] = breadcrumbs
  const hiddenBreadcrumbs = rest.slice(0, -maxVisible)
  const visibleBreadcrumbs = rest.slice(-maxVisible)

  if (breadcrumbs.length < 2 || !home) {
    return <JsonLdBreadcrumbs breadcrumbs={breadcrumbs} />
  }

  return (
    <Stack paddingBlock={1} overflow='hidden'>
      <JsonLdBreadcrumbs breadcrumbs={breadcrumbs} />
      <StyledMuiBreadcrumbs aria-label='Breadcrumb' separator='>'>
        <IconButton key='home' component={Link} to={home.pathname} aria-label={home.title}>
          <HomeOutlinedIcon />
        </IconButton>
        {hiddenBreadcrumbs.length > 0 && (
          <IconButton key='menu' onClick={openMenu} aria-label={t('showMore')}>
            <MoreHorizIcon />
          </IconButton>
        )}
        {visibleBreadcrumbs.map(breadcrumb => (
          <Breadcrumb key={breadcrumb.title} title={breadcrumb.title} to={breadcrumb.pathname} />
        ))}
      </StyledMuiBreadcrumbs>
      <Menu anchorEl={menuAnchorElement} open={!!menuAnchorElement} onClose={closeMenu}>
        {hiddenBreadcrumbs.map(item => (
          <MenuItem key={item.pathname} component={Link} to={item.pathname}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}

export default Breadcrumbs
