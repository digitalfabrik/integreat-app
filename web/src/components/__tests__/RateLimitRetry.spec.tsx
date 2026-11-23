import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { act, render } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { rateLimitRetryOptions, ResponseError } from 'shared/api'

import RateLimitRetry from '../RateLimitRetry'
import ThemeContainer from '../ThemeContainer'

jest.useFakeTimers()

const createResponseError = (status: number): ResponseError =>
  new ResponseError({
    endpointName: 'test',
    response: { status, statusText: '' } as Response,
    url: 'https://example.com',
    requestOptions: { method: 'GET' },
  })

const Content = ({ queryFn }: { queryFn: () => Promise<string> }): ReactElement => {
  const { data, error } = useQuery({ queryKey: ['test'], queryFn })
  if (error) {
    return <div>failed</div>
  }
  return <div>{data ?? 'loading'}</div>
}

const renderWithQueryFn = (queryFn: () => Promise<string>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: rateLimitRetryOptions } })
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ThemeContainer contentDirection='ltr'>
          <Content queryFn={queryFn} />
          <RateLimitRetry />
        </ThemeContainer>
      </QueryClientProvider>,
    ),
  }
}

const advance = async (ms: number) => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms)
  })
}

describe('RateLimitRetry', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should show a shrinking progress bar and retry rate limited requests after the delay', async () => {
    const queryFn = jest
      .fn<Promise<string>, []>()
      .mockRejectedValueOnce(createResponseError(429))
      .mockResolvedValue('content')
    const { getByRole, queryByRole, getByText } = renderWithQueryFn(queryFn)

    await advance(0)
    expect(queryFn).toHaveBeenCalledTimes(1)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(getByText('error:rateLimitedRetry')).toBeTruthy()
    expect(getByText('error:seconds 65')).toBeTruthy()

    await advance(32_500)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    expect(getByText('error:seconds 33')).toBeTruthy()
    expect(queryFn).toHaveBeenCalledTimes(1)

    await advance(33_000)
    expect(queryFn).toHaveBeenCalledTimes(2)
    expect(getByText('content')).toBeTruthy()
    expect(queryByRole('progressbar')).toBeNull()
  })

  it('should not retry or show the snackbar for other errors', async () => {
    const queryFn = jest.fn<Promise<string>, []>().mockRejectedValue(createResponseError(500))
    const { queryByRole, getByText } = renderWithQueryFn(queryFn)

    await advance(0)
    expect(getByText('failed')).toBeTruthy()
    expect(queryByRole('progressbar')).toBeNull()
    await advance(120_000)
    expect(queryFn).toHaveBeenCalledTimes(1)
  })

  it('should show the error after the maximum number of retries', async () => {
    const queryFn = jest.fn<Promise<string>, []>().mockRejectedValue(createResponseError(429))
    const { queryByRole, getByText } = renderWithQueryFn(queryFn)

    await advance(6 * 70_000)
    expect(queryFn).toHaveBeenCalledTimes(6)
    expect(getByText('failed')).toBeTruthy()
    expect(queryByRole('progressbar')).toBeNull()
  })
})
