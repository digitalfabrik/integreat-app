import { act, renderHook } from '@testing-library/react'

import FetchError from '../errors/FetchError.ts'
import ResponseError from '../errors/ResponseError.ts'
import { isRateLimitError, rateLimitRetryOptions, useRateLimitRetryWindow } from '../rateLimit.ts'

jest.useFakeTimers()

const MAX_DELAY = 69_000

const createResponseError = (status: number): ResponseError =>
  new ResponseError({
    endpointName: 'test',
    response: { status, statusText: '' } as Response,
    url: 'https://example.com',
    requestOptions: { method: 'GET' },
  })

describe('rateLimit', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const scheduleRetryAt = (now: number, random: number): number => {
    jest.setSystemTime(now)
    jest.spyOn(Math, 'random').mockReturnValue(random)
    return rateLimitRetryOptions.retryDelay()
  }

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

  it('should only retry rate limited requests up to the maximum number of retries', () => {
    const error = createResponseError(429)
    expect(rateLimitRetryOptions.retry(0, error)).toBe(true)
    expect(rateLimitRetryOptions.retry(4, error)).toBe(true)
    expect(rateLimitRetryOptions.retry(5, error)).toBe(false)
    expect(rateLimitRetryOptions.retry(0, createResponseError(500))).toBe(false)
  })

  it.each`
    random   | delay
    ${0}     | ${60_000}
    ${0.5}   | ${65_000}
    ${0.999} | ${MAX_DELAY}
  `('should return a retry delay of $delay ms for random $random', ({ random, delay }) => {
    // Start after any window scheduled by previous tests has ended
    expect(scheduleRetryAt(Date.now() + MAX_DELAY, random)).toBe(delay)
  })

  it('should let all requests failing during an active window retry at its end', () => {
    // Start after any window scheduled by previous tests has ended
    const start = Date.now() + MAX_DELAY
    const { result } = renderHook(useRateLimitRetryWindow)

    act(() => {
      expect(scheduleRetryAt(start, 0)).toBe(60_000)
    })
    expect(result.current).toEqual({ start, end: start + 60_000 })

    act(() => {
      expect(scheduleRetryAt(start + 1000, 0.999)).toBe(59_000)
    })
    expect(result.current).toEqual({ start, end: start + 60_000 })

    const later = start + 60_000
    act(() => {
      expect(scheduleRetryAt(later, 0.999)).toBe(MAX_DELAY)
    })
    expect(result.current).toEqual({ start: later, end: later + MAX_DELAY })
  })
})
