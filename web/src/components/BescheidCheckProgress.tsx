import shouldForwardProp from '@emotion/is-prop-valid'
import CheckIcon from '@mui/icons-material/Check'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import RefreshIcon from '@mui/icons-material/Refresh'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ANALYSIS_STEPS, BescheidCheckProgressStatus } from 'shared'
import { BescheidCheckAnalysisError, fromError } from 'shared/api'

import { MAX_PROGRESS } from '../constants/bescheidCheck'
import { getErrorMessage } from './FailureSwitcher'
import { DirectionDependentForwardIcon } from './base/DirectionDependentIcons'

const Container = styled(Stack)(({ theme }) => ({
  gap: 24,

  [theme.breakpoints.up('md')]: {
    paddingInline: 24,
  },
}))

const StyledAvatar = styled(Avatar, { shouldForwardProp })<{ done: boolean }>(({ theme, done }) => ({
  width: 40,
  height: 40,
  backgroundColor: done ? theme.palette.success.main : theme.palette.background.accent,
  color: done ? theme.palette.success.contrastText : theme.palette.primary.main,
}))

type BescheidCheckProgressProps = {
  status: BescheidCheckProgressStatus
  error: Error | null
  retry: () => void
  showResult: () => void
  startNewAnalysis: () => void
}

const BescheidCheckProgress = ({
  status,
  error,
  retry,
  showResult,
  startNewAnalysis,
}: BescheidCheckProgressProps): ReactElement => {
  const { t } = useTranslation()

  if (error) {
    return (
      <Container>
        <Alert severity='error'>
          {error instanceof BescheidCheckAnalysisError
            ? t($ => $.bescheidCheck.progress.failed)
            : getErrorMessage(fromError(error), t)}
        </Alert>
        <Button variant='contained' startIcon={<RefreshIcon />} onClick={retry} sx={{ alignSelf: 'flex-start' }}>
          {t($ => $.error.tryAgain)}
        </Button>
      </Container>
    )
  }

  const isDone = status === 'done'
  const step = isDone ? ANALYSIS_STEPS.length : ANALYSIS_STEPS.indexOf(status) + 1
  const stepLabel = t($ => $.bescheidCheck.progress.steps[status])

  return (
    <Container>
      <Stack direction='row' sx={{ gap: 2 }}>
        <StyledAvatar done={isDone}>{isDone ? <CheckIcon /> : <FindInPageIcon />}</StyledAvatar>
        <Stack sx={{ gap: 1 }}>
          <Typography variant='subtitle1' component='h2'>
            {t($ => $.bescheidCheck.progress.title[isDone ? 'done' : 'analyzing'])}
          </Typography>
          <Typography variant='body3'>
            {t($ => $.bescheidCheck.progress.description[isDone ? 'done' : 'analyzing'])}
          </Typography>
        </Stack>
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography variant='body3' aria-live='polite' sx={{ alignSelf: 'flex-start' }}>
          {stepLabel}
        </Typography>
        <Stack direction='row' sx={{ alignItems: 'center', gap: 2 }}>
          <LinearProgress
            variant='determinate'
            value={(step / ANALYSIS_STEPS.length) * MAX_PROGRESS}
            aria-label={stepLabel}
            sx={{ flexGrow: 1 }}
          />
          <Typography variant='body3' sx={{ flexShrink: 0 }}>
            {t($ => $.bescheidCheck.progress.step, { step, total: ANALYSIS_STEPS.length })}
          </Typography>
        </Stack>
      </Stack>
      {isDone && (
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
          <Button variant='outlined' startIcon={<RefreshIcon />} onClick={startNewAnalysis} sx={{ flex: 1 }}>
            {t($ => $.bescheidCheck.progress.startNewAnalysis)}
          </Button>
          <Button variant='contained' endIcon={<DirectionDependentForwardIcon />} onClick={showResult} sx={{ flex: 1 }}>
            {t($ => $.bescheidCheck.progress.showResult)}
          </Button>
        </Stack>
      )}
    </Container>
  )
}

export default BescheidCheckProgress
