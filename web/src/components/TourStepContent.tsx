import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { StepType } from '@reactour/tour'
import { SelectorParam, TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'

export type ArrowAlignment = 'left' | 'right'

export type TourStepType = StepType & {
  content: ReactElement
  arrowAlignment?: ArrowAlignment
  offset?: { horizontal?: number; vertical?: number }
}

export type TourStepsProps = {
  t: TFunction
  rtl: boolean
  region: RegionModel
  languageCode: string
}

type TourStepContentProps = {
  title: string
  descriptionKey: SelectorParam
}

const TourStepContent = ({ title, descriptionKey }: TourStepContentProps): ReactElement => (
  <Stack sx={{ gap: 1 }}>
    <Box sx={{ paddingInlineEnd: 3 }}>
      <Typography variant='subtitle1'>{title}</Typography>
    </Box>
    <Typography variant='body2'>
      <Trans i18nKey={descriptionKey} values={{ appName: buildConfig().appName }} components={{ strong: <strong /> }} />
    </Typography>
  </Stack>
)

export default TourStepContent
