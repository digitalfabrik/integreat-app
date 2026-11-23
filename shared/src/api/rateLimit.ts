import { useSyncExternalStore } from 'react'

import { ErrorCodes, fromError } from './ErrorCodes.ts'

const MAX_RATE_LIMIT_RETRIES = 5
const RATE_LIMIT_BASE_DELAY_MS = 60_000
const RATE_LIMIT_MAX_JITTER_SECONDS = 9
const MS_PER_SECOND = 1000

type RateLimitRetryWindow = {
  start: number
  end: number
}

type Listener = () => void

let retryWindow: RateLimitRetryWindow | null = null
const listeners = new Set<Listener>()

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = (): RateLimitRetryWindow | null => retryWindow

export const isRateLimitError = (error: unknown): boolean => fromError(error) === ErrorCodes.RateLimited

const shouldRetryRateLimitedRequest = (failureCount: number, error: unknown): boolean =>
  isRateLimitError(error) && failureCount < MAX_RATE_LIMIT_RETRIES

// Starts a new retry window with a jittered delay if none is active.
// Requests failing during an active window retry together at its end, so the countdown matches the actual retry.
const scheduleRateLimitRetry = (): number => {
  const now = Date.now()
  if (retryWindow === null || retryWindow.end <= now) {
    const delay =
      RATE_LIMIT_BASE_DELAY_MS + Math.floor(Math.random() * (RATE_LIMIT_MAX_JITTER_SECONDS + 1)) * MS_PER_SECOND
    retryWindow = { start: now, end: now + delay }
    listeners.forEach(listener => listener())
  }
  return retryWindow.end - now
}

export const rateLimitRetryOptions = {
  retry: shouldRetryRateLimitedRequest,
  retryDelay: scheduleRateLimitRetry,
}

export const useRateLimitRetryWindow = (): RateLimitRetryWindow | null => useSyncExternalStore(subscribe, getSnapshot)
