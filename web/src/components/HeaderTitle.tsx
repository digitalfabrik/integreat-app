import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25

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
  const { xsmall } = useDimensions()
  const { t } = useTranslation('layout')
  const { featureFlags } = buildConfig()
  const variant = title.length >= LONG_TITLE_LENGTH && xsmall ? 'subtitle2' : 'subtitle1'
  const [tooltipOpen, setTooltipOpen] = useState(false)

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
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}>
      <Button
        component={Link}
        to={landingPath}
        endIcon={<KeyboardArrowDownIcon />}
        color='inherit'
        onMouseDown={() => setTooltipOpen(false)}>
        <StyledTitle variant={variant}>{title}</StyledTitle>
      </Button>
    </Tooltip>
  )
}

export default HeaderTitle
