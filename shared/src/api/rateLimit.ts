import { ErrorCodes, fromError } from './ErrorCodes.ts'

export const MAX_RATE_LIMIT_RETRIES = 5
const RATE_LIMIT_BASE_DELAY_MS = 60_000
const RATE_LIMIT_MAX_JITTER_SECONDS = 9
const MS_PER_SECOND = 1000

export type RateLimitRetryWindow = {
  start: number
  end: number
}

type Listener = () => void

let retryWindow: RateLimitRetryWindow | null = null
const listeners = new Set<Listener>()

export const isRateLimitError = (error: unknown): boolean => fromError(error) === ErrorCodes.RateLimited

export const getRateLimitRetryDelay = (): number =>
  RATE_LIMIT_BASE_DELAY_MS + Math.floor(Math.random() * (RATE_LIMIT_MAX_JITTER_SECONDS + 1)) * MS_PER_SECOND

export const shouldRetryRateLimitedRequest = (failureCount: number, error: unknown): boolean =>
  isRateLimitError(error) && failureCount < MAX_RATE_LIMIT_RETRIES

export const getRateLimitRetryWindow = (): RateLimitRetryWindow | null => retryWindow

export const subscribeToRateLimitRetryWindow = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Concurrent requests each get their own delay, the window always covers the latest scheduled retry
export const scheduleRateLimitRetry = (delay: number, now: number = Date.now()): number => {
  const end = now + delay
  const activeWindow = retryWindow !== null && retryWindow.end > now ? retryWindow : null
  if (activeWindow === null || end > activeWindow.end) {
    retryWindow = { start: activeWindow?.start ?? now, end }
    listeners.forEach(listener => listener())
  }
  return delay
}

export const resetRateLimitRetryWindow = (): void => {
  retryWindow = null
  listeners.forEach(listener => listener())
}
