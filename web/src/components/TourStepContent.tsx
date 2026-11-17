import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SelectorParam } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { TOUR_STEP_DESCRIPTION_ELEMENT_ID, TOUR_STEP_TITLE_ELEMENT_ID } from '../constants/tour'
import useDimensions from '../hooks/useDimensions'

type TourStepContentProps = {
  title: string
  descriptionKey: SelectorParam
  values?: Record<string, string[]>
}

const TourStepContent = ({ title, descriptionKey, values }: TourStepContentProps): ReactElement => {
  const { t } = useTranslation()
  const { desktop } = useDimensions()
  const additionalFeature = desktop ? t($ => $.settings.contrast.title) : t($ => $.feedback.title)

  return (
    <Stack sx={{ gap: 1 }}>
      <Box sx={{ paddingInlineEnd: 3 }}>
        <Typography
          id={TOUR_STEP_TITLE_ELEMENT_ID}
          variant='subtitle1'
          // Invisible comma to let screen readers pause after the title
          sx={{ '&::after': { content: '"" / ","' } }}>
          {title}
        </Typography>
      </Box>
      <Typography id={TOUR_STEP_DESCRIPTION_ELEMENT_ID} variant='body2'>
        <Trans
          i18nKey={descriptionKey}
          values={{ appName: buildConfig().appName, additionalFeature, ...values }}
          components={{ strong: <strong /> }}
        />
      </Typography>
    </Stack>
  )
}

export default TourStepContent
