import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { HEADER_TITLE_ELEMENT_ID } from '../constants/layout'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 'normal',

  [theme.breakpoints.down('sm')]: {
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
}))

type HeaderTitleProps = {
  title: string
  regionsPath: string
}

const HeaderTitle = ({ title, regionsPath }: HeaderTitleProps): ReactElement => {
  const { xsmall } = useDimensions()
  const { t } = useTranslation()
  const { featureFlags } = buildConfig()
  const variant = title.length >= LONG_TITLE_LENGTH && xsmall ? 'subtitle2' : 'subtitle1'
  const [tooltipOpen, setTooltipOpen] = useState(false)

  if (featureFlags.fixedRegion) {
    return (
      <StyledTitle variant={variant} sx={{ alignContent: 'center' }}>
        {title}
      </StyledTitle>
    )
  }
  return (
    <Tooltip
      title={t($ => $.layout.changeLocation)}
      open={tooltipOpen}
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}>
      <Button
        id={HEADER_TITLE_ELEMENT_ID}
        component={Link}
        to={regionsPath}
        endIcon={<KeyboardArrowDownIcon />}
        color='inherit'
        onMouseDown={() => setTooltipOpen(false)}>
        <StyledTitle variant={variant}>{title}</StyledTitle>
      </Button>
    </Tooltip>
  )
}

export default HeaderTitle
