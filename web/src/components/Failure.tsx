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

const Failure = ({ errorMessage, goToPath, goToMessage = 'goTo.start', className }: FailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <Stack alignItems='center' textAlign='center' paddingTop={8} paddingInline={2} gap={3} className={className}>
      <SentimentVeryDissatisfiedIcon fontSize='large' />
      <div role='alert'>{t(errorMessage)} </div>
      {!!goToPath && (
        <Link to={goToPath} highlighted>
          {goToMessage ? t(goToMessage) : goToPath}
        </Link>
      )}
    </Stack>
  )
}

export default Failure
