import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { PlacesType } from 'react-tooltip'
import styled, { useTheme } from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { spacesToDashes } from '../utils/stringUtils'
import Icon from './base/Icon'
import Tooltip from './base/Tooltip'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

type HeaderActionItemLinkProps = {
  href?: string
  text: string
  iconSrc: string
}

const HeaderActionItemLink = ({ href, text, iconSrc }: HeaderActionItemLinkProps): ReactElement => {
  const id = spacesToDashes(text)

  const theme = useTheme()
  const { width } = useWindowDimensions()
  const bufferForTooltipOverflow = 130
  const isMediumViewport = width < dimensions.maxWidth + bufferForTooltipOverflow
  const tooltipDirectionMediumDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'left' : 'right'
  const tooltipDirection: PlacesType = isMediumViewport ? tooltipDirectionMediumDesktop : 'bottom'

  return (
    <Tooltip
      id={id}
      place={tooltipDirection}
      container={
        href ? (
          <Link to={href} aria-label={text} id={id}>
            <StyledIcon src={iconSrc} />
          </Link>
        ) : (
          <span aria-label={text} id={id}>
            <StyledIcon src={iconSrc} />
          </span>
        )
      }>
      {text}
    </Tooltip>
  )
}

export default HeaderActionItemLink
