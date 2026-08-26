import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

type FailureProps = {
  errorMessage: string
  goToPath?: string
  goToMessage?: string
  className?: string
}

const Failure = ({ errorMessage, goToPath, goToMessage, className }: FailureProps): ReactElement => {
  const { t } = useTranslation()
  return (
    <Stack
      className={className}
      sx={{ alignItems: 'center', textAlign: 'center', paddingTop: 8, paddingInline: 2, gap: 3 }}>
      <SentimentVeryDissatisfiedIcon fontSize='large' />
      <div role='alert'>{errorMessage} </div>
      {!!goToPath && (
        <Link to={goToPath} highlighted>
          {goToMessage ?? t($ => $.error.goTo.start)}
        </Link>
      )}
    </Stack>
  )
}

export default Failure
