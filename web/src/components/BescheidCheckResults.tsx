import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const BescheidCheckResults = (): ReactElement => {
  const { t } = useTranslation()

  return (
    <Typography variant='subtitle1' component='h2'>
      {t($ => $.bescheidCheck.results.title)}
    </Typography>
  )
}

export default BescheidCheckResults
