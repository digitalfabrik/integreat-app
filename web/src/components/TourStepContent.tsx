import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { StepType } from '@reactour/tour'
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import { RegionModel } from 'shared/api'

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
  descriptionKey: string
}

const TourStepContent = ({ title, descriptionKey }: TourStepContentProps): ReactElement => (
  <Stack gap={1}>
    <Typography variant='subtitle1'>{title}</Typography>
    <Typography variant='body2'>
      <Trans i18nKey={`tour:${descriptionKey}`} components={{ strong: <strong /> }} />
    </Typography>
  </Stack>
)

export default TourStepContent
