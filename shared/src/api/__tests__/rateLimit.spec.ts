import FetchError from '../errors/FetchError.ts'
import ResponseError from '../errors/ResponseError.ts'
import {
  getRateLimitRetryDelay,
  getRateLimitRetryWindow,
  isRateLimitError,
  MAX_RATE_LIMIT_RETRIES,
  resetRateLimitRetryWindow,
  scheduleRateLimitRetry,
  shouldRetryRateLimitedRequest,
  subscribeToRateLimitRetryWindow,
} from '../rateLimit.ts'

const createResponseError = (status: number): ResponseError =>
  new ResponseError({
    endpointName: 'test',
    response: { status, statusText: '' } as Response,
    url: 'https://example.com',
    requestOptions: { method: 'GET' },
  })

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimitRetryWindow()
    jest.restoreAllMocks()
  })

  it('should detect rate limit errors', () => {
    expect(isRateLimitError(createResponseError(429))).toBe(true)
    expect(isRateLimitError(createResponseError(500))).toBe(false)
    expect(
      isRateLimitError(
        new FetchError({
          endpointName: 'test',
          innerError: new Error(),
          url: 'https://example.com',
          requestOptions: {},
        }),
      ),
    ).toBe(false)
    expect(isRateLimitError(null)).toBe(false)
  })

  it.each`
    random   | delay
    ${0}     | ${60_000}
    ${0.5}   | ${65_000}
    ${0.999} | ${69_000}
  `('should return a retry delay of $delay ms for random $random', ({ random, delay }) => {
    jest.spyOn(Math, 'random').mockReturnValue(random)
    expect(getRateLimitRetryDelay()).toBe(delay)
  })

  it('should only retry rate limited requests up to the maximum number of retries', () => {
    const error = createResponseError(429)
    expect(shouldRetryRateLimitedRequest(0, error)).toBe(true)
    expect(shouldRetryRateLimitedRequest(MAX_RATE_LIMIT_RETRIES - 1, error)).toBe(true)
    expect(shouldRetryRateLimitedRequest(MAX_RATE_LIMIT_RETRIES, error)).toBe(false)
    expect(shouldRetryRateLimitedRequest(0, createResponseError(500))).toBe(false)
  })

  it('should extend the retry window to the latest scheduled retry and notify listeners', () => {
    const listener = jest.fn()
    const unsubscribe = subscribeToRateLimitRetryWindow(listener)

    expect(scheduleRateLimitRetry(60_000, 1000)).toBe(60_000)
    expect(getRateLimitRetryWindow()).toEqual({ start: 1000, end: 61_000 })

    scheduleRateLimitRetry(65_000, 2000)
    expect(getRateLimitRetryWindow()).toEqual({ start: 1000, end: 67_000 })

    scheduleRateLimitRetry(60_000, 3000)
    expect(getRateLimitRetryWindow()).toEqual({ start: 1000, end: 67_000 })
    expect(listener).toHaveBeenCalledTimes(2)

    scheduleRateLimitRetry(60_000, 70_000)
    expect(getRateLimitRetryWindow()).toEqual({ start: 70_000, end: 130_000 })

    unsubscribe()
    resetRateLimitRetryWindow()
    expect(listener).toHaveBeenCalledTimes(3)
    expect(getRateLimitRetryWindow()).toBeNull()
  })
})
