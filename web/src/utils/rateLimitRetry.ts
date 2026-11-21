import { getRateLimitRetryDelay, scheduleRateLimitRetry, shouldRetryRateLimitedRequest } from 'shared/api'

export const rateLimitRetryOptions = {
  retry: shouldRetryRateLimitedRequest,
  retryDelay: (): number => scheduleRateLimitRetry(getRateLimitRetryDelay()),
}
