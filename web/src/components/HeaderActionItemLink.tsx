import { useTheme } from '@emotion/react'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement } from 'react'
import { PlacesType } from 'react-tooltip'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { spacesToDashes } from '../utils/stringUtils'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

type HeaderActionItemLinkProps = {
  to: string
  text: string
  icon: ReactElement
}

const HeaderActionItemLink = ({ to, text, icon }: HeaderActionItemLinkProps): ReactElement => {
  const id = spacesToDashes(text)
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const bufferForTooltipOverflow = 130
  const isMediumViewport = width < theme.breakpoints.values.lg + bufferForTooltipOverflow
  const tooltipDirectionMediumDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'left' : 'right'
  const tooltipDirection: PlacesType = isMediumViewport ? tooltipDirectionMediumDesktop : 'bottom'

  return (
    <Tooltip id={id} place={tooltipDirection} tooltipContent={text}>
      <Link to={to} ariaLabel={text} id={id}>
        <IconButton
          name={text}
          color='primary'
          sx={{ backgroundColor: theme.palette.tertiary.light }}
          size='medium'
          aria-label={text}>
          {icon}
        </IconButton>
      </Link>
    </Tooltip>
  )
}

export default HeaderActionItemLink
