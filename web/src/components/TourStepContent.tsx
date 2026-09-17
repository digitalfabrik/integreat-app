import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SelectorParam } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'

type TourStepContentProps = {
  title: string
  descriptionKey: SelectorParam
}

const TourStepContent = ({ title, descriptionKey }: TourStepContentProps): ReactElement => {
  const { t } = useTranslation()
  const { desktop } = useDimensions()
  const additionalFeature = desktop ? t($ => $.settings.contrast.title) : t($ => $.feedback.title)

  return (
    <Stack sx={{ gap: 1 }}>
      <Box sx={{ paddingInlineEnd: 3 }}>
        <Typography variant='subtitle1'>{title}</Typography>
      </Box>
      <Typography variant='body2'>
        <Trans
          i18nKey={descriptionKey}
          values={{ appName: buildConfig().appName, additionalFeature }}
          components={{ strong: <strong /> }}
        />
      </Typography>
    </Stack>
  )
}

export default TourStepContent
