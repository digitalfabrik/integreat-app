import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import { useIsFetching } from '@tanstack/react-query'
import React, { ReactElement, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isRateLimitError, useRateLimitRetryWindow } from 'shared/api'

import Snackbar from './base/Snackbar'

const TICK_INTERVAL_MS = 250
const MS_PER_SECOND = 1000
const MAX_PROGRESS = 100

const RateLimitRetry = (): ReactElement | null => {
  const [remaining, setRemaining] = useState(0)
  const isWaiting = useIsFetching({ predicate: query => isRateLimitError(query.state.fetchFailureReason) }) > 0
  const retryWindow = useRateLimitRetryWindow()
  const { t } = useTranslation()

  useLayoutEffect(() => {
    if (!isWaiting || retryWindow === null) {
      return undefined
    }
    const tick = () => setRemaining(Math.max(retryWindow.end - Date.now(), 0))
    tick()
    const interval = setInterval(tick, TICK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isWaiting, retryWindow])

  if (!isWaiting || retryWindow === null) {
    return null
  }

  const total = retryWindow.end - retryWindow.start
  const progress = (remaining / total) * MAX_PROGRESS
  const seconds = Math.ceil(remaining / MS_PER_SECOND)
  const message = t($ => $.error.rateLimitedRetry)

  return (
    <Snackbar open severity='info' message={message}>
      <Stack direction='row' sx={{ alignItems: 'center', gap: 2, marginTop: 1 }}>
        <LinearProgress variant='determinate' value={progress} aria-label={message} sx={{ flexGrow: 1 }} />
        <span aria-hidden>{t($ => $.error.seconds, { seconds })}</span>
      </Stack>
    </Snackbar>
  )
}

export default RateLimitRetry
