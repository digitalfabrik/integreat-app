import { render } from '@testing-library/react-native'
import React from 'react'

import { MappingError } from 'shared/api'

import { captureError } from '../../utils/sentry'
import useCaptureError from '../useCaptureError'

jest.mock('../../utils/sentry')

describe('useCaptureError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const MockComponent = ({ error }: { error: Error | null }) => {
    useCaptureError(error)
    return null
  }

  it('should report error', async () => {
    const { rerender } = render(<MockComponent error={null} />)
    expect(captureError).not.toHaveBeenCalled()

    const error = new MappingError('regions', 'some error')
    rerender(<MockComponent error={error} />)

    expect(captureError).toHaveBeenCalledTimes(1)
    expect(captureError).toHaveBeenCalledWith(error)

    rerender(<MockComponent error={null} />)
    expect(captureError).toHaveBeenCalledTimes(1)
  })
})
