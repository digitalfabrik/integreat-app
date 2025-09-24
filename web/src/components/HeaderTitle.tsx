import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { featureFlags } = buildConfig()
  const variant = title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'

  if (featureFlags.fixedCity) {
    return (
      <Typography variant={variant} alignContent='center'>
        {title}
      </Typography>
    )
  }
  return (
    <Tooltip title={t('changeLocation')} leaveTouchDelay={0}>
      <Button component={Link} to={landingPath} endIcon={<KeyboardArrowDownIcon />} color='inherit'>
        <Typography variant={variant}>{title}</Typography>
      </Button>
    </Tooltip>
  )
}

export default HeaderTitle
