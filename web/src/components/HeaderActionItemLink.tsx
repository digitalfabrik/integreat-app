import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement } from 'react'
import { PlacesType } from 'react-tooltip'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { spacesToDashes } from '../utils/stringUtils'
import Icon from './base/Icon'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

type HeaderActionItemLinkProps = {
  to?: string
  text: string
  iconSrc: string | ElementType<SvgIconProps>
}

const HeaderActionItemLink = ({ to, text, iconSrc }: HeaderActionItemLinkProps): ReactElement => {
  const id = spacesToDashes(text)

  const theme = useTheme()
  const { width } = useWindowDimensions()
  const bufferForTooltipOverflow = 130
  const isMediumViewport = width < theme.breakpoints.values.lg + bufferForTooltipOverflow
  const tooltipDirectionMediumDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'left' : 'right'
  const tooltipDirection: PlacesType = isMediumViewport ? tooltipDirectionMediumDesktop : 'bottom'

  return (
    <Tooltip id={id} place={tooltipDirection} tooltipContent={text}>
      {to ? (
        <Link to={to} ariaLabel={text} id={id}>
          <StyledIcon src={iconSrc} />
        </Link>
      ) : (
        <span aria-label={text} id={id}>
          <StyledIcon src={iconSrc} />
        </span>
      )}
    </Tooltip>
  )
}

export default HeaderActionItemLink
