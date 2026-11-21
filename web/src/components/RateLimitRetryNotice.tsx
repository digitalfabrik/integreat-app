import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import React, { ReactElement, useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import { getRateLimitRetryWindow, isRateLimitError, subscribeToRateLimitRetryWindow } from 'shared/api'

const TICK_INTERVAL_MS = 250
const MS_PER_SECOND = 1000
const MAX_PROGRESS = 100

const useIsWaitingForRateLimitRetry = (): boolean => {
  const queryCache = useQueryClient().getQueryCache()
  const subscribe = useCallback((onChange: () => void) => queryCache.subscribe(onChange), [queryCache])
  const getSnapshot = useCallback(
    () =>
      queryCache
        .getAll()
        .some(query => query.state.fetchStatus !== 'idle' && isRateLimitError(query.state.fetchFailureReason)),
    [queryCache],
  )
  return useSyncExternalStore(subscribe, getSnapshot)
}

const RateLimitRetryNotice = (): ReactElement | null => {
  const { t } = useTranslation()
  const isWaiting = useIsWaitingForRateLimitRetry()
  const retryWindow = useSyncExternalStore(subscribeToRateLimitRetryWindow, getRateLimitRetryWindow)
  const [now, setNow] = useState(Date.now)

  const isActive = isWaiting && retryWindow !== null

  useEffect(() => {
    if (!isActive) {
      return undefined
    }
    setNow(Date.now())
    const interval = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isActive, retryWindow])

  if (!isActive) {
    return null
  }

  const remaining = Math.max(retryWindow.end - now, 0)
  const total = Math.max(retryWindow.end - retryWindow.start, 1)
  const progress = (remaining / total) * MAX_PROGRESS
  const seconds = Math.ceil(remaining / MS_PER_SECOND)
  const message = t($ => $.error.rateLimitedRetry)

  return (
    <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity='info' role='status' sx={{ width: '100%' }}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant='body2'>{message}</Typography>
          <Stack direction='row' sx={{ alignItems: 'center', gap: 2 }}>
            <LinearProgress variant='determinate' value={progress} aria-label={message} sx={{ flexGrow: 1 }} />
            <Typography variant='body2' aria-hidden sx={{ flexShrink: 0 }}>
              {t($ => $.error.rateLimitedRetryCountdown, { seconds })}
            </Typography>
          </Stack>
        </Stack>
      </Alert>
    </Snackbar>
  )
}

export default RateLimitRetryNotice
