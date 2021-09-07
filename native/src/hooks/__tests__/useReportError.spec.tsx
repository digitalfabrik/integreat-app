import { render } from '@testing-library/react-native'
import React from 'react'

import { MappingError } from 'api-client'

import { reportError } from '../../utils/helpers'
import useReportError from '../useReportError'

jest.mock('../../utils/helpers', () => ({
  reportError: jest.fn()
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
