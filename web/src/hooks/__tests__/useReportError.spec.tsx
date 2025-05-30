import { render } from '@testing-library/react'
import React from 'react'

import { MappingError } from 'shared/api'

import { reportError } from '../../utils/sentry'
import useReportError from '../useReportError'

jest.mock('../../utils/sentry', () => ({
  reportError: jest.fn(async () => null),
}))

describe('useReportError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const MockComponent = ({ error }: { error: Error | null }) => {
    useReportError(error)
    return null
  }

  it('should report error', async () => {
    const { rerender } = render(<MockComponent error={null} />)
    expect(reportError).not.toHaveBeenCalled()

    const error = new MappingError('cities', 'some error')
    rerender(<MockComponent error={error} />)

    expect(reportError).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error)

    rerender(<MockComponent error={null} />)
    expect(reportError).toHaveBeenCalledTimes(1)
  })
})
