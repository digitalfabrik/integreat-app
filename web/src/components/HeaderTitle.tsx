import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25
const NAVIGATION_RESET_DELAY = 1000

const StyledTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
}))

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { featureFlags } = buildConfig()
  const variant = title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const isNavigatingRef = useRef(false)

  const handleMouseEnter = () => {
    // Only show tooltip if not currently navigating
    if (!isNavigatingRef.current) {
      setTooltipOpen(true)
    }
  }

  const handleMouseLeave = () => {
    // Close tooltip when mouse leaves button area
    setTooltipOpen(false)
  }

  const handleMouseDown = () => {
    // Close tooltip and mark as navigating before onClick fires
    isNavigatingRef.current = true
    setTooltipOpen(false)

    // Reset navigation flag after transition completes
    setTimeout(() => {
      isNavigatingRef.current = false
    }, NAVIGATION_RESET_DELAY)
  }

  if (featureFlags.fixedCity !== null) {
    return (
      <StyledTitle variant={variant} alignContent='center'>
        {title}
      </StyledTitle>
    )
  }
  return (
    <Tooltip
      title={t('changeLocation')}
      open={tooltipOpen}
      disableFocusListener
      disableTouchListener
      disableInteractive>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Wrapper div needed for mouse event handling without TypeScript conflicts */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown}>
        <Button component={Link} to={landingPath} endIcon={<KeyboardArrowDownIcon />} color='inherit'>
          <StyledTitle variant={variant}>{title}</StyledTitle>
        </Button>
      </div>
    </Tooltip>
  )
}

export default HeaderTitle
