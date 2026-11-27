import shouldForwardProp from '@emotion/is-prop-valid'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckIcon from '@mui/icons-material/Check'
import DownloadIcon from '@mui/icons-material/Download'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import RefreshIcon from '@mui/icons-material/Refresh'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip, { chipClasses } from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { bescheidCheckName, formatDate, UNSUPPORTED_BESCHEID_TYPE } from 'shared'
import { BescheidCheckResult as AnalysisResult } from 'shared/api'

import { PLACEHOLDER_EXPLANATION } from '../constants/bescheidCheck'
import RemoteContent from './RemoteContent'

const NOT_RECOGNIZED_STEPS = ['tryAgain', 'counseling', 'keepBescheid'] as const

const StyledStack = styled(Stack, { shouldForwardProp })<{ recognized: boolean }>(({ theme, recognized }) => ({
  gap: 12,
  padding: 24,
  borderRadius: 8,
  border: `1px solid ${recognized ? theme.palette.divider : alpha(theme.palette.error.main, theme.palette.action.disabledOpacity)}`,
  backgroundColor: recognized
    ? alpha(theme.palette.background.accent, theme.palette.action.disabledOpacity)
    : alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
}))

const StatusChip = styled(Chip)<{ color: 'success' | 'warning' | 'error' }>(({ theme, color }) => ({
  fontWeight: 600,
  color: theme.palette[color].main,
  backgroundColor: alpha(theme.palette[color].main, theme.palette.action.focusOpacity),

  [`& .${chipClasses.icon}`]: {
    color: 'inherit',
  },
}))

type BescheidCheckResultProps = {
  result: AnalysisResult
  startNewAnalysis: () => void
}

const BescheidCheckResult = ({ result, startNewAnalysis }: BescheidCheckResultProps): ReactElement => {
  const { classification, topic, consequences, actionRequired, deadline, explanation } = result
  const recognized = classification.type !== UNSUPPORTED_BESCHEID_TYPE
  const { t, i18n } = useTranslation()
  const title = recognized
    ? (explanation?.title ?? topic ?? PLACEHOLDER_EXPLANATION.title)
    : t($ => $.bescheidCheck.result.notRecognized.title)
  const { summaryTitle, summary, meaningTitle, meaning } = PLACEHOLDER_EXPLANATION
  const steps = recognized
    ? PLACEHOLDER_EXPLANATION.steps
    : NOT_RECOGNIZED_STEPS.map(step => ({
        title: t($ => $.bescheidCheck.result.notRecognized.steps[step].title),
        description: t($ => $.bescheidCheck.result.notRecognized.steps[step].description),
      }))

  const deadlineLabel = deadline?.date
    ? t($ => $.bescheidCheck.result.deadlineUntil, {
        date: formatDate(deadline.date, { locale: i18n.language, showYear: true }),
      })
    : t($ => $.bescheidCheck.result.deadline)

  return (
    <Stack sx={{ gap: 3 }}>
      {recognized && (
        <Typography variant='h4' component='h2'>
          {t($ => $.bescheidCheck.result.title)}
        </Typography>
      )}
      <StyledStack recognized={recognized}>
        <Stack direction='row' sx={{ gap: 1, flexWrap: 'wrap' }}>
          {recognized ? (
            <>
              <StatusChip
                size='small'
                color='success'
                icon={<CheckIcon />}
                label={t($ => $.bescheidCheck.result.documentTypeRecognized)}
              />
              {actionRequired && (
                <StatusChip
                  size='small'
                  color='warning'
                  icon={<PriorityHighIcon />}
                  label={t($ => $.bescheidCheck.result.actionRequired)}
                />
              )}
              {deadline && <StatusChip size='small' color='error' icon={<AccessTimeIcon />} label={deadlineLabel} />}
            </>
          ) : (
            <StatusChip
              size='small'
              color='error'
              icon={<ErrorOutlineIcon />}
              label={t($ => $.bescheidCheck.result.analysisFailed)}
            />
          )}
        </Stack>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant='h4' component='h3'>
            {title}
          </Typography>
          <Typography variant='body2'>
            {recognized
              ? t($ => $.bescheidCheck.result.description)
              : t($ => $.bescheidCheck.result.notRecognized.description, { name: bescheidCheckName })}
          </Typography>
        </Stack>
      </StyledStack>
      {explanation ? (
        <RemoteContent html={explanation.content} />
      ) : (
        <Stack sx={{ gap: 2 }}>
          {recognized && (
            <>
              <Typography variant='h4' component='h2'>
                {summaryTitle}
              </Typography>
              <Typography>{summary}</Typography>
              <Typography variant='h4' component='h2'>
                {meaningTitle}
              </Typography>
              {(consequences.length > 0 ? consequences : meaning).map(text => (
                <Typography key={text}>{text}</Typography>
              ))}
            </>
          )}
          <Typography variant='h4' component='h2'>
            {t($ => $.bescheidCheck.result.nextSteps)}
          </Typography>
          <Stepper orientation='vertical'>
            {steps.map(step => (
              <Step key={step.title} active>
                <StepLabel sx={{ alignItems: 'flex-start' }}>
                  <Stack>
                    <Typography sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
                    <Typography>{step.description}</Typography>
                  </Stack>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      )}
      {recognized && (
        <Alert severity='info'>
          <Trans ns='bescheidCheck' i18nKey={$ => $.bescheidCheck.disclaimer} values={{ name: bescheidCheckName }} />
        </Alert>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1.5, justifyContent: 'flex-end', displayPrint: 'none' }}>
        <Button variant='contained' startIcon={<RefreshIcon />} onClick={startNewAnalysis}>
          {t($ => $.bescheidCheck.progress.startNewAnalysis)}
        </Button>
        <Button variant='outlined' startIcon={<DownloadIcon />} onClick={() => window.print()}>
          {t($ => $.categories.pdf.create)}
        </Button>
      </Stack>
    </Stack>
  )
}

export default BescheidCheckResult
