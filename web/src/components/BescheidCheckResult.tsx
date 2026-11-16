import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import RefreshIcon from '@mui/icons-material/Refresh'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { bescheidCheckName } from 'shared'
import { BescheidCheckResult as BescheidCheckResultType } from 'shared/api'

import RemoteContent from './RemoteContent'
import Link from './base/Link'

type BescheidCheckResultProps = {
  result: BescheidCheckResultType
  startNewAnalysis: () => void
}

const BescheidCheckResult = ({ result, startNewAnalysis }: BescheidCheckResultProps): ReactElement => {
  const { t } = useTranslation()
  const { explanation } = result

  return (
    <Stack sx={{ gap: 3, paddingInline: { md: 3 } }}>
      <Typography variant='subtitle1' component='h2'>
        {t($ => $.bescheidCheck.result.title)}
      </Typography>
      <Stack component='section' sx={{ gap: 1 }}>
        <Typography variant='subtitle2' component='h3'>
          {t($ => $.bescheidCheck.result.explanation)}
        </Typography>
        {explanation ? (
          <>
            <Typography variant='h6' component='h4'>
              {explanation.title}
            </Typography>
            <RemoteContent html={explanation.content} />
            <Link
              to={explanation.url}
              highlighted
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, alignSelf: 'flex-start' }}>
              {t($ => $.bescheidCheck.result.moreInformation)}
              <OpenInNewIcon fontSize='small' />
            </Link>
          </>
        ) : (
          <Alert severity='info'>{t($ => $.bescheidCheck.result.noExplanation)}</Alert>
        )}
      </Stack>
      <Button
        variant='outlined'
        startIcon={<RefreshIcon />}
        onClick={startNewAnalysis}
        sx={{ alignSelf: 'flex-start' }}>
        {t($ => $.bescheidCheck.progress.startNewAnalysis)}
      </Button>
      <Alert severity='info'>
        <Trans ns='bescheidCheck' i18nKey={$ => $.bescheidCheck.disclaimer} values={{ name: bescheidCheckName }} />
      </Alert>
    </Stack>
  )
}

export default BescheidCheckResult
